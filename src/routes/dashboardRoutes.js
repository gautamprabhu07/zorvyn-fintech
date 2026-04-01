const express = require('express');
const {
  getSummary,
  getCategoryBreakdown,
  getRecentActivity,
  getMonthlyTrends,
} = require('../controllers/dashboardController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', protect, authorizeRoles('ANALYST', 'ADMIN'), getSummary);
router.get('/category-breakdown', protect, authorizeRoles('ANALYST', 'ADMIN'), getCategoryBreakdown);
router.get('/recent-activity', protect, authorizeRoles('ANALYST', 'ADMIN'), getRecentActivity);
router.get('/monthly-trends', protect, authorizeRoles('ANALYST', 'ADMIN'), getMonthlyTrends);

module.exports = router;
