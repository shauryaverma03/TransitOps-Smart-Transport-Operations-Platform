const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const auth = require('../middleware/auth');
const { rbac, ROLES } = require('../middleware/rbac');

router.use(auth);

router.get('/', rbac([ROLES.FINANCIAL_ANALYST, ROLES.FLEET_MANAGER]), getExpenses);
router.post('/', rbac([ROLES.FINANCIAL_ANALYST, ROLES.DISPATCHER]), createExpense);
router.put('/:id', rbac([ROLES.FINANCIAL_ANALYST]), updateExpense);
router.delete('/:id', rbac([ROLES.FINANCIAL_ANALYST]), deleteExpense);

module.exports = router;
