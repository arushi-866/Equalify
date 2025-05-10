const express = require('express');
const router = express.Router();
const {
  getBudgetCategories,
  createBudgetCategory,
  updateBudgetCategory,
  deleteBudgetCategory,
  recordExpense,
  getMonthlySummary
} = require('../controllers/budgetController');
const protect = require('../middleware/auth'); // ✅ Corrected

router.use(protect); // ✅ protect should be a function, not destructured

router.route('/')
  .get(getBudgetCategories)
  .post(createBudgetCategory);

router.route('/:id')
  .put(updateBudgetCategory)
  .delete(deleteBudgetCategory);

router.route('/expense')
  .post(recordExpense);

router.route('/monthly-summary')
  .get(getMonthlySummary);

module.exports = router;
