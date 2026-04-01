const allowedTypes = ['INCOME', 'EXPENSE'];

const validateFinancialRecord = (req, res, next) => {
  const { amount, type, category, date } = req.body || {};
  const errors = [];

  const normalizedAmount = Number(amount);
  if (amount === undefined || amount === null || Number.isNaN(normalizedAmount) || normalizedAmount <= 0) {
    errors.push('amount must be a positive number');
  }

  const normalizedType = type ? String(type).trim().toUpperCase() : '';
  if (!allowedTypes.includes(normalizedType)) {
    errors.push('type must be either INCOME or EXPENSE');
  }

  const normalizedCategory = category ? String(category).trim() : '';
  if (!normalizedCategory) {
    errors.push('category is required');
  }

  const parsedDate = new Date(date);
  if (!date || Number.isNaN(parsedDate.getTime())) {
    errors.push('date must be a valid date');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.body.amount = normalizedAmount;
  req.body.type = normalizedType;
  req.body.category = normalizedCategory;
  req.body.date = parsedDate;

  return next();
};

const validateFinancialRecordUpdate = (req, res, next) => {
  const body = req.body || {};
  const errors = [];

  if (Object.keys(body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one field is required to update the record',
    });
  }

  if (body.amount !== undefined) {
    const normalizedAmount = Number(body.amount);

    if (Number.isNaN(normalizedAmount) || normalizedAmount <= 0) {
      errors.push('amount must be a positive number');
    } else {
      req.body.amount = normalizedAmount;
    }
  }

  if (body.type !== undefined) {
    const normalizedType = String(body.type).trim().toUpperCase();

    if (!allowedTypes.includes(normalizedType)) {
      errors.push('type must be either INCOME or EXPENSE');
    } else {
      req.body.type = normalizedType;
    }
  }

  if (body.category !== undefined) {
    const normalizedCategory = String(body.category).trim();

    if (!normalizedCategory) {
      errors.push('category cannot be empty');
    } else {
      req.body.category = normalizedCategory;
    }
  }

  if (body.date !== undefined) {
    const parsedDate = new Date(body.date);

    if (Number.isNaN(parsedDate.getTime())) {
      errors.push('date must be a valid date');
    } else {
      req.body.date = parsedDate;
    }
  }

  if (body.note !== undefined) {
    req.body.note = String(body.note).trim();
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  return next();
};

module.exports = {
  validateFinancialRecord,
  validateFinancialRecordUpdate,
};
