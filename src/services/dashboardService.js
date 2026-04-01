const FinancialRecord = require('../models/FinancialRecord');

const ALLOWED_TYPES = ['INCOME', 'EXPENSE'];

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const parseDate = (value, fieldName) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw createError(`${fieldName} must be a valid date`, 400);
  }

  return parsedDate;
};

const buildMatchStage = (filters = {}) => {
  const { type, category, startDate, endDate } = filters;
  const match = {
    isDeleted: false,
  };

  if (type !== undefined) {
    const normalizedType = String(type).trim().toUpperCase();

    if (!ALLOWED_TYPES.includes(normalizedType)) {
      throw createError('type must be either INCOME or EXPENSE', 400);
    }

    match.type = normalizedType;
  }

  if (category !== undefined) {
    const normalizedCategory = String(category).trim();

    if (!normalizedCategory) {
      throw createError('category cannot be empty', 400);
    }

    match.category = normalizedCategory;
  }

  if (startDate !== undefined || endDate !== undefined) {
    match.date = {};

    if (startDate !== undefined) {
      match.date.$gte = parseDate(startDate, 'startDate');
    }

    if (endDate !== undefined) {
      match.date.$lte = parseDate(endDate, 'endDate');
    }

    if (match.date.$gte && match.date.$lte && match.date.$gte > match.date.$lte) {
      throw createError('startDate cannot be greater than endDate', 400);
    }
  }

  return match;
};

const getSummary = async (filters = {}) => {
  const match = buildMatchStage(filters);

  const [summary] = await FinancialRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0],
          },
        },
        totalExpense: {
          $sum: {
            $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalIncome: 1,
        totalExpense: 1,
        netBalance: { $subtract: ['$totalIncome', '$totalExpense'] },
      },
    },
  ]);

  return (
    summary || {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
    }
  );
};

const getCategoryBreakdown = async (filters = {}) => {
  const match = buildMatchStage(filters);

  return FinancialRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        incomeTotal: {
          $sum: {
            $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0],
          },
        },
        expenseTotal: {
          $sum: {
            $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        total: 1,
        incomeTotal: 1,
        expenseTotal: 1,
      },
    },
    { $sort: { total: -1, category: 1 } },
  ]);
};

const getRecentActivity = async (filters = {}) => {
  const { limit = '10' } = filters;
  const parsedLimit = Number.parseInt(limit, 10);

  if (Number.isNaN(parsedLimit) || parsedLimit < 1) {
    throw createError('limit must be a positive integer', 400);
  }

  const match = buildMatchStage(filters);

  return FinancialRecord.find(match)
    .sort({ date: -1, createdAt: -1 })
    .limit(parsedLimit)
    .lean();
};

const getMonthlyTrends = async (filters = {}) => {
  const match = buildMatchStage(filters);

  return FinancialRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        income: {
          $sum: {
            $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        income: 1,
        expense: 1,
        netBalance: { $subtract: ['$income', '$expense'] },
      },
    },
    { $sort: { year: 1, month: 1 } },
  ]);
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getRecentActivity,
  getMonthlyTrends,
};
