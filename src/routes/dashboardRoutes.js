const express = require('express');
const {
  getSummary,
  getCategoryBreakdown,
  getRecentActivity,
  getMonthlyTrends,
} = require('../controllers/dashboardController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorizeRoles('ANALYST', 'ADMIN'));

router.get('/summary', getSummary);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/recent', getRecentActivity);
router.get('/trends', getMonthlyTrends);
router.get('/recent-activity', getRecentActivity);
router.get('/monthly-trends', getMonthlyTrends);

module.exports = router;
