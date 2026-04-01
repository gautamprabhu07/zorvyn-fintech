const FinancialRecord = require('../models/FinancialRecord');
const mongoose = require('mongoose');

const allowedTypes = ['INCOME', 'EXPENSE'];

const sendError = (res, statusCode, message, errors) => {
  const payload = {
    success: false,
    message,
  };

  if (errors && errors.length > 0) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};

const handleControllerError = (res, error) => {
  if (error instanceof mongoose.Error.CastError && error.path === '_id') {
    return sendError(res, 400, 'Invalid record id');
  }

  if (error.name === 'ValidationError') {
    return sendError(res, 400, error.message);
  }

  return sendError(res, 500, 'Internal server error');
};

const createFinancialRecord = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return sendError(res, 401, 'Authentication required');
    }

    const { amount, type, category, date, note } = req.body || {};

    const record = await FinancialRecord.create({
      userId: req.user.id,
      amount,
      type,
      category,
      date,
      note,
    });

    return res.status(201).json({
      success: true,
      message: 'Financial record created successfully',
      data: record,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const getFinancialRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = '1', limit = '10' } = req.query;
    const query = {
      isDeleted: false,
    };

    const parsedPage = Number.parseInt(page, 10);
    const parsedLimit = Number.parseInt(limit, 10);

    if (Number.isNaN(parsedPage) || parsedPage < 1) {
      return sendError(res, 400, 'page must be a positive integer');
    }

    if (Number.isNaN(parsedLimit) || parsedLimit < 1) {
      return sendError(res, 400, 'limit must be a positive integer');
    }

    if (type !== undefined) {
      const normalizedType = String(type).trim().toUpperCase();

      if (!allowedTypes.includes(normalizedType)) {
        return sendError(res, 400, 'type must be either INCOME or EXPENSE');
      }

      query.type = normalizedType;
    }

    if (category !== undefined) {
      const normalizedCategory = String(category).trim();

      if (!normalizedCategory) {
        return sendError(res, 400, 'category cannot be empty');
      }

      query.category = normalizedCategory;
    }

    if (startDate !== undefined || endDate !== undefined) {
      query.date = {};

      if (startDate !== undefined) {
        const parsedStartDate = new Date(startDate);

        if (Number.isNaN(parsedStartDate.getTime())) {
          return sendError(res, 400, 'startDate must be a valid date');
        }

        query.date.$gte = parsedStartDate;
      }

      if (endDate !== undefined) {
        const parsedEndDate = new Date(endDate);

        if (Number.isNaN(parsedEndDate.getTime())) {
          return sendError(res, 400, 'endDate must be a valid date');
        }

        query.date.$lte = parsedEndDate;
      }

      if (query.date.$gte && query.date.$lte && query.date.$gte > query.date.$lte) {
        return sendError(res, 400, 'startDate cannot be greater than endDate');
      }
    }

    const skip = (parsedPage - 1) * parsedLimit;

    const [records, totalCount] = await Promise.all([
      FinancialRecord.find(query).sort({ date: -1 }).skip(skip).limit(parsedLimit),
      FinancialRecord.countDocuments(query),
    ]);

    const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / parsedLimit);

    return res.status(200).json({
      success: true,
      count: records.length,
      totalCount,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        totalPages,
      },
      data: records,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const getFinancialRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid record id');
    }

    const record = await FinancialRecord.findOne({ _id: id, isDeleted: false });

    if (!record) {
      return sendError(res, 404, 'Financial record not found');
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const updateFinancialRecord = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid record id');
    }

    const updates = {};
    const allowedFields = ['amount', 'type', 'category', 'date', 'note'];

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return sendError(res, 400, 'At least one updatable field is required');
    }

    const record = await FinancialRecord.findOneAndUpdate({ _id: id, isDeleted: false }, updates, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      return sendError(res, 404, 'Financial record not found');
    }

    return res.status(200).json({
      success: true,
      message: 'Financial record updated successfully',
      data: record,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const deleteFinancialRecord = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid record id');
    }

    const record = await FinancialRecord.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!record) {
      return sendError(res, 404, 'Financial record not found');
    }

    return res.status(200).json({
      success: true,
      message: 'Financial record deleted successfully',
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

module.exports = {
  createFinancialRecord,
  getFinancialRecords,
  getFinancialRecordById,
  updateFinancialRecord,
  deleteFinancialRecord,
};
