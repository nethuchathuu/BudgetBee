const { pool } = require('../config/db');

const expensesController = {
  // Add new expense
  addExpense: async (req, res) => {
    try {
      const { user_id, bill_date, shop_name, category_name, product_name, price } = req.body;

      // Validation
      if (!user_id || !bill_date || !category_name || !product_name || !price) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: user_id, bill_date, category_name, product_name, price'
        });
      }

      const query = `
        INSERT INTO expenses (user_id, bill_date, shop_name, category_name, product_name, price)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const [result] = await pool.execute(query, [user_id, bill_date, shop_name, category_name, product_name, price]);

      res.status(201).json({
        success: true,
        message: 'Expense added successfully',
        expense_id: result.insertId
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Daily summary - current date
  getDailySummary: async (req, res) => {
    try {
      const { user_id } = req.params;

      const query = `
        SELECT 
          category_name,
          product_name,
          SUM(price) AS product_total,
          SUM(SUM(price)) OVER (PARTITION BY category_name) AS category_total
        FROM expenses
        WHERE bill_date = CURDATE()
          AND user_id = ?
        GROUP BY category_name, product_name
        ORDER BY category_name, product_total DESC
      `;

      const [rows] = await pool.execute(query, [user_id]);

      res.status(200).json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error fetching daily summary:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Daily summary - selected date
  getSelectedDateSummary: async (req, res) => {
    try {
      const { user_id, selected_date } = req.params;

      const query = `
        SELECT 
          category_name,
          product_name,
          SUM(price) AS product_total,
          SUM(SUM(price)) OVER (PARTITION BY category_name) AS category_total
        FROM expenses
        WHERE bill_date = ?
          AND user_id = ?
        GROUP BY category_name, product_name
        ORDER BY category_name, product_total DESC
      `;

      const [rows] = await pool.execute(query, [selected_date, user_id]);

      res.status(200).json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error fetching selected date summary:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Weekly summary - current week
  getWeeklySummary: async (req, res) => {
    try {
      const { user_id } = req.params;

      const query = `
        SELECT 
          category_name,
          product_name,
          SUM(price) AS product_total
        FROM expenses
        WHERE YEARWEEK(bill_date, 1) = YEARWEEK(CURDATE(), 1)
          AND user_id = ?
        GROUP BY category_name, product_name
        ORDER BY category_name
      `;

      const [rows] = await pool.execute(query, [user_id]);

      res.status(200).json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error fetching weekly summary:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Weekly summary - selected week
  getSelectedWeekSummary: async (req, res) => {
    try {
      const { user_id, selected_week } = req.params;

      const query = `
        SELECT 
          category_name,
          product_name,
          SUM(price) AS product_total
        FROM expenses
        WHERE YEARWEEK(bill_date, 1) = ?
          AND user_id = ?
        GROUP BY category_name, product_name
        ORDER BY category_name
      `;

      const [rows] = await pool.execute(query, [selected_week, user_id]);

      res.status(200).json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error fetching selected week summary:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Monthly summary - current month
  getMonthlySummary: async (req, res) => {
    try {
      const { user_id } = req.params;

      const query = `
        SELECT 
          category_name,
          product_name,
          SUM(price) AS product_total
        FROM expenses
        WHERE YEAR(bill_date) = YEAR(CURDATE())
          AND MONTH(bill_date) = MONTH(CURDATE())
          AND user_id = ?
        GROUP BY category_name, product_name
        ORDER BY category_name
      `;

      const [rows] = await pool.execute(query, [user_id]);

      res.status(200).json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Monthly summary - selected month
  getSelectedMonthSummary: async (req, res) => {
    try {
      const { user_id, year, month } = req.params;

      const query = `
        SELECT 
          category_name,
          product_name,
          SUM(price) AS product_total
        FROM expenses
        WHERE YEAR(bill_date) = ?
          AND MONTH(bill_date) = ?
          AND user_id = ?
        GROUP BY category_name, product_name
        ORDER BY category_name
      `;

      const [rows] = await pool.execute(query, [year, month, user_id]);

      res.status(200).json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error fetching selected month summary:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Yearly summary - current year
  getYearlySummary: async (req, res) => {
    try {
      const { user_id } = req.params;

      const query = `
        SELECT 
          category_name,
          product_name,
          SUM(price) AS product_total
        FROM expenses
        WHERE YEAR(bill_date) = YEAR(CURDATE())
          AND user_id = ?
        GROUP BY category_name, product_name
        ORDER BY category_name
      `;

      const [rows] = await pool.execute(query, [user_id]);

      res.status(200).json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error fetching yearly summary:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Yearly summary - selected year
  getSelectedYearSummary: async (req, res) => {
    try {
      const { user_id, year } = req.params;

      const query = `
        SELECT 
          category_name,
          product_name,
          SUM(price) AS product_total
        FROM expenses
        WHERE YEAR(bill_date) = ?
          AND user_id = ?
        GROUP BY category_name, product_name
        ORDER BY category_name
      `;

      const [rows] = await pool.execute(query, [year, user_id]);

      res.status(200).json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error fetching selected year summary:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get all expenses for a user
  getAllExpenses: async (req, res) => {
    try {
      const { user_id } = req.params;

      const query = `
        SELECT *
        FROM expenses
        WHERE user_id = ?
        ORDER BY bill_date DESC, created_at DESC
      `;

      const [rows] = await pool.execute(query, [user_id]);

      res.status(200).json({
        success: true,
        data: rows
      });
    } catch (error) {
      console.error('Error fetching all expenses:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Delete expense
  deleteExpense: async (req, res) => {
    try {
      const { expense_id } = req.params;

      const query = `DELETE FROM expenses WHERE id = ?`;

      const [result] = await pool.execute(query, [expense_id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Expense not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Expense deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = expensesController;
