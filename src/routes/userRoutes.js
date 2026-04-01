const express = require('express');
const { updateUserStatus } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.patch('/:id/status', protect, authorizeRoles('ADMIN'), updateUserStatus);

module.exports = router;