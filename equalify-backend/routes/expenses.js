const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

// Core CRUD operations
router.get('/group/:groupId', auth, expenseController.getExpensesByGroup);
router.post('/', auth, expenseController.createExpense);
router.put('/settle/:expenseId', auth, expenseController.settleExpense);
router.delete('/:expenseId', auth, expenseController.deleteExpense);

// Additional analytics routes
router.get('/recent', auth, expenseController.getRecentExpenses);
router.get('/splits', auth, expenseController.getExpenseSplits);
router.get('/monthly', auth, expenseController.getMonthlySpending);

module.exports = router;
