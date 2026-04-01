const dashboardService = require('../services/dashboardService');

const sendControllerError = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.statusCode ? error.message : 'Internal server error';

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const getSummary = async (req, res) => {
  try {
    const summary = await dashboardService.getSummary(req.query);

    return res.status(200).json(summary);
  } catch (error) {
    return sendControllerError(res, error);
  }
};

const getCategoryBreakdown = async (req, res) => {
  try {
    const data = await dashboardService.getCategoryBreakdown(req.query);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return sendControllerError(res, error);
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const data = await dashboardService.getRecentActivity(req.query);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return sendControllerError(res, error);
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const data = await dashboardService.getMonthlyTrends(req.query);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return sendControllerError(res, error);
  }
};

module.exports = {
  getSummary,
  getCategoryBreakdown,
  getRecentActivity,
  getMonthlyTrends,
};
