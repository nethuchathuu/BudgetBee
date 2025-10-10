const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expensesController');
const { verifyUser } = require('../middlewares/verifyUser');

// Test route (no authentication required)
router.get('/test', (req, res) => {
  res.json({ message: 'Expenses API is working!', timestamp: new Date().toISOString() });
});

// Add new expense
router.post('/add', verifyUser, expensesController.addExpense);

// Daily summary - current date (temporarily without auth for testing)
router.get('/summary/daily/:user_id', expensesController.getDailySummary);

// Daily summary - selected date
router.get('/summary/daily/:user_id/:selected_date', verifyUser, expensesController.getSelectedDateSummary);

// Weekly summary - current week
router.get('/summary/weekly/:user_id', verifyUser, expensesController.getWeeklySummary);

// Weekly summary - selected week
router.get('/summary/weekly/:user_id/:selected_week', verifyUser, expensesController.getSelectedWeekSummary);

// Monthly summary - current month
router.get('/summary/monthly/:user_id', verifyUser, expensesController.getMonthlySummary);

// Monthly summary - selected month
router.get('/summary/monthly/:user_id/:year/:month', verifyUser, expensesController.getSelectedMonthSummary);

// Yearly summary - current year
router.get('/summary/yearly/:user_id', verifyUser, expensesController.getYearlySummary);

// Yearly summary - selected year
router.get('/summary/yearly/:user_id/:year', verifyUser, expensesController.getSelectedYearSummary);

// Get all expenses for a user
router.get('/all/:user_id', verifyUser, expensesController.getAllExpenses);

// Delete expense
router.delete('/:expense_id', verifyUser, expensesController.deleteExpense);

module.exports = router;