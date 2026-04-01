const express = require('express');
const {
	createFinancialRecord,
	getFinancialRecords,
	getFinancialRecordById,
	updateFinancialRecord,
	deleteFinancialRecord,
} = require('../controllers/financialRecordController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
	validateFinancialRecord,
	validateFinancialRecordUpdate,
} = require('../middleware/financialRecordValidation');

const router = express.Router();

router.get('/', protect, authorizeRoles('ANALYST', 'ADMIN'), getFinancialRecords);
router.post('/', protect, authorizeRoles('ADMIN'), validateFinancialRecord, createFinancialRecord);
router.get('/:id', protect, authorizeRoles('ANALYST', 'ADMIN'), getFinancialRecordById);
router.patch('/:id', protect, authorizeRoles('ADMIN'), validateFinancialRecordUpdate, updateFinancialRecord);
router.delete('/:id', protect, authorizeRoles('ADMIN'), deleteFinancialRecord);

module.exports = router;
