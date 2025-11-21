const db = require('../config/db');
const { runLimitChecks } = require('../utils/limitChecker');

// Helper function to generate consistent colors for categories
const generateCategoryColor = (category) => {
  const colors = [
    '#4A90E2', '#2ECC71', '#E74C3C', '#F39C12', 
    '#9B59B6', '#1ABC9C', '#34495E', '#E67E22',
    '#3498DB', '#27AE60', '#C0392B', '#D35400'
  ];
  
  // Generate consistent color based on category name hash
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const expensesController = {
  // Add new expense
  addExpense: async (req, res) => {
    try {
      const { user_id, bill_date, shop_name, category_name, product_name, price, created_at } = req.body;

      // Normalize currency and amount to LKR (system currency)
      const normalizedPrice = Number(parseFloat(price)) || 0;

      // Use bill_date as created_at if created_at is not provided (fallback)
      const effectiveCreatedAt = created_at || bill_date;

      console.log('💾 Adding expense with created_at:', {
        bill_date,
        created_at: effectiveCreatedAt,
        category: category_name,
        product: product_name
      });

      // Validation
      if (!user_id || !bill_date || !category_name || !product_name || !price) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: user_id, bill_date, category_name, product_name, price'
        });
      }

      // First try: Insert with created_at field
      const queryWithCreatedAt = `
        INSERT INTO expenses (user_id, bill_date, shop_name, category_name, product_name, price, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      try {
        const [result] = await db.execute(queryWithCreatedAt, [
          user_id, 
          bill_date, 
          shop_name, 
          category_name, 
          product_name, 
          normalizedPrice, 
          effectiveCreatedAt
        ]);
        console.log('✅ Expense saved with created_at:', effectiveCreatedAt);
        
        // Trigger limit checks after adding expense
        runLimitChecks(user_id).catch(err => {
          console.error('Error running limit checks:', err);
        });
        
        return res.status(201).json({
          success: true,
          message: 'Expense added successfully',
          expense_id: result.insertId
        });
      } catch (err) {
        // If created_at column doesn't exist, fall back to basic insert
        console.error('Insert with created_at failed:', err?.code || err?.errno, err?.message);
        const isMissingColumn = err && (err.code === 'ER_BAD_FIELD_ERROR' || err.errno === 1054 || /Unknown column/i.test(String(err.message)));
        
        if (isMissingColumn) {
          console.warn('⚠️ created_at column not found, using basic insert (will use CURRENT_TIMESTAMP)');
          const queryBasic = `
            INSERT INTO expenses (user_id, bill_date, shop_name, category_name, product_name, price)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          const [result2] = await db.execute(queryBasic, [
            user_id, 
            bill_date, 
            shop_name, 
            category_name, 
            product_name, 
            normalizedPrice
          ]);
          return res.status(201).json({
            success: true,
            message: 'Expense added successfully (without created_at)',
            expense_id: result2.insertId,
            warning: 'created_at column not available, using default timestamp'
          });
        }
        // rethrow other errors to outer catch
        throw err;
      }
    } catch (error) {
      console.error('❌ Error adding expense:', error);
      // Provide dev-friendly error details when not in production to aid debugging
      const devDetails = process.env.NODE_ENV !== 'production' ? { error: String(error.message), stack: error.stack } : {};
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        ...devDetails
      });
    }
  },

  // Daily summary - current date
  getDailySummary: async (req, res) => {
    try {
      const { user_id } = req.params;

      // Get all expenses for the current date
      const expensesQuery = `
        SELECT 
          category_name,
          product_name,
          price
        FROM expenses
        WHERE DATE(created_at) = CURDATE()
          AND user_id = ?
        ORDER BY category_name, product_name
      `;

      const [expenseRows] = await db.execute(expensesQuery, [user_id]);

      // Group by category with products
      const categoryMap = {};
      let totalSpent = 0;

      expenseRows.forEach(row => {
        const category = row.category_name;
        const productName = row.product_name;
        const price = Number(row.price) || 0;
        totalSpent += price;

        if (!categoryMap[category]) {
          categoryMap[category] = {
            category_name: category,
            category_total: 0,
            productMap: {}
          };
        }

        categoryMap[category].category_total += price;
        
        // Aggregate products by name
        if (!categoryMap[category].productMap[productName]) {
          categoryMap[category].productMap[productName] = 0;
        }
        categoryMap[category].productMap[productName] += price;
      });

      // Convert to array and aggregate products
      const categories = Object.values(categoryMap).map(cat => ({
        category_name: cat.category_name,
        category_total: cat.category_total,
        products: Object.entries(cat.productMap).map(([name, total]) => ({
          product_name: name,
          product_total: total
        }))
      })).sort((a, b) => b.category_total - a.category_total);

      res.status(200).json(categories);
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

      // Get all expenses for the selected date
      const expensesQuery = `
        SELECT 
          category_name,
          product_name,
          price
        FROM expenses
        WHERE DATE(created_at) = ?
          AND user_id = ?
        ORDER BY category_name, product_name
      `;

      const [expenseRows] = await db.execute(expensesQuery, [selected_date, user_id]);

      // Group by category with products
      const categoryMap = {};
      let totalSpent = 0;

      expenseRows.forEach(row => {
        const category = row.category_name;
        const productName = row.product_name;
        const price = Number(row.price) || 0;
        totalSpent += price;

        if (!categoryMap[category]) {
          categoryMap[category] = {
            category_name: category,
            category_total: 0,
            productMap: {}
          };
        }

        categoryMap[category].category_total += price;
        
        // Aggregate products by name
        if (!categoryMap[category].productMap[productName]) {
          categoryMap[category].productMap[productName] = 0;
        }
        categoryMap[category].productMap[productName] += price;
      });

      // Convert to array and aggregate products
      const categories = Object.values(categoryMap).map(cat => ({
        category_name: cat.category_name,
        category_total: cat.category_total,
        products: Object.entries(cat.productMap).map(([name, total]) => ({
          product_name: name,
          product_total: total
        }))
      })).sort((a, b) => b.category_total - a.category_total);

      res.status(200).json(categories);
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

      // Get all expenses for the current week
      const expensesQuery = `
        SELECT 
          category_name,
          product_name,
          price
        FROM expenses
        WHERE YEARWEEK(created_at,1) = YEARWEEK(CURDATE(),1)
          AND user_id = ?
        ORDER BY category_name, product_name
      `;

      const [expenseRows] = await db.execute(expensesQuery, [user_id]);

      // Group by category with products
      const categoryMap = {};
      let totalSpent = 0;

      expenseRows.forEach(row => {
        const category = row.category_name;
        const productName = row.product_name;
        const price = Number(row.price) || 0;
        totalSpent += price;

        if (!categoryMap[category]) {
          categoryMap[category] = {
            category_name: category,
            category_total: 0,
            productMap: {}
          };
        }

        categoryMap[category].category_total += price;
        
        // Aggregate products by name
        if (!categoryMap[category].productMap[productName]) {
          categoryMap[category].productMap[productName] = 0;
        }
        categoryMap[category].productMap[productName] += price;
      });

      // Convert to array and aggregate products
      const categories = Object.values(categoryMap).map(cat => ({
        category_name: cat.category_name,
        category_total: cat.category_total,
        products: Object.entries(cat.productMap).map(([name, total]) => ({
          product_name: name,
          product_total: total
        }))
      })).sort((a, b) => b.category_total - a.category_total);

      res.status(200).json(categories);
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

      // Get all expenses for the selected week
      const expensesQuery = `
        SELECT 
          category_name,
          product_name,
          price
        FROM expenses
        WHERE YEARWEEK(created_at,1) = ?
          AND user_id = ?
        ORDER BY category_name, product_name
      `;

      const [expenseRows] = await db.execute(expensesQuery, [selected_week, user_id]);

      // Group by category with products
      const categoryMap = {};
      let totalSpent = 0;

      expenseRows.forEach(row => {
        const category = row.category_name;
        const productName = row.product_name;
        const price = Number(row.price) || 0;
        totalSpent += price;

        if (!categoryMap[category]) {
          categoryMap[category] = {
            category_name: category,
            category_total: 0,
            productMap: {}
          };
        }

        categoryMap[category].category_total += price;
        
        // Aggregate products by name
        if (!categoryMap[category].productMap[productName]) {
          categoryMap[category].productMap[productName] = 0;
        }
        categoryMap[category].productMap[productName] += price;
      });

      // Convert to array and aggregate products
      const categories = Object.values(categoryMap).map(cat => ({
        category_name: cat.category_name,
        category_total: cat.category_total,
        products: Object.entries(cat.productMap).map(([name, total]) => ({
          product_name: name,
          product_total: total
        }))
      })).sort((a, b) => b.category_total - a.category_total);

      res.status(200).json(categories);
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

      // Get all expenses for the current month
      const expensesQuery = `
        SELECT 
          category_name,
          product_name,
          price
        FROM expenses
        WHERE MONTH(created_at) = MONTH(CURDATE())
          AND YEAR(created_at) = YEAR(CURDATE())
          AND user_id = ?
        ORDER BY category_name, product_name
      `;

      const [expenseRows] = await db.execute(expensesQuery, [user_id]);

      // Group by category with products
      const categoryMap = {};
      let totalSpent = 0;

      expenseRows.forEach(row => {
        const category = row.category_name;
        const productName = row.product_name;
        const price = Number(row.price) || 0;
        totalSpent += price;

        if (!categoryMap[category]) {
          categoryMap[category] = {
            category_name: category,
            category_total: 0,
            productMap: {}
          };
        }

        categoryMap[category].category_total += price;
        
        // Aggregate products by name
        if (!categoryMap[category].productMap[productName]) {
          categoryMap[category].productMap[productName] = 0;
        }
        categoryMap[category].productMap[productName] += price;
      });

      // Convert to array and aggregate products
      const categories = Object.values(categoryMap).map(cat => ({
        category_name: cat.category_name,
        category_total: cat.category_total,
        products: Object.entries(cat.productMap).map(([name, total]) => ({
          product_name: name,
          product_total: total
        }))
      })).sort((a, b) => b.category_total - a.category_total);

      res.status(200).json(categories);
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

      // Get all expenses for the selected month
      const expensesQuery = `
        SELECT 
          category_name,
          product_name,
          price
        FROM expenses
        WHERE YEAR(created_at) = ?
          AND MONTH(created_at) = ?
          AND user_id = ?
        ORDER BY category_name, product_name
      `;

      const [expenseRows] = await db.execute(expensesQuery, [year, month, user_id]);

      // Group by category with products
      const categoryMap = {};
      let totalSpent = 0;

      expenseRows.forEach(row => {
        const category = row.category_name;
        const productName = row.product_name;
        const price = Number(row.price) || 0;
        totalSpent += price;

        if (!categoryMap[category]) {
          categoryMap[category] = {
            category_name: category,
            category_total: 0,
            productMap: {}
          };
        }

        categoryMap[category].category_total += price;
        
        // Aggregate products by name
        if (!categoryMap[category].productMap[productName]) {
          categoryMap[category].productMap[productName] = 0;
        }
        categoryMap[category].productMap[productName] += price;
      });

      // Convert to array and aggregate products
      const categories = Object.values(categoryMap).map(cat => ({
        category_name: cat.category_name,
        category_total: cat.category_total,
        products: Object.entries(cat.productMap).map(([name, total]) => ({
          product_name: name,
          product_total: total
        }))
      })).sort((a, b) => b.category_total - a.category_total);

      res.status(200).json(categories);
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

      // Get all expenses for the current year
      const expensesQuery = `
        SELECT 
          category_name,
          product_name,
          price
        FROM expenses
        WHERE YEAR(created_at) = YEAR(CURDATE())
          AND user_id = ?
        ORDER BY category_name, product_name
      `;

      const [expenseRows] = await db.execute(expensesQuery, [user_id]);

      // Group by category with products
      const categoryMap = {};
      let totalSpent = 0;

      expenseRows.forEach(row => {
        const category = row.category_name;
        const productName = row.product_name;
        const price = Number(row.price) || 0;
        totalSpent += price;

        if (!categoryMap[category]) {
          categoryMap[category] = {
            category_name: category,
            category_total: 0,
            productMap: {}
          };
        }

        categoryMap[category].category_total += price;
        
        // Aggregate products by name
        if (!categoryMap[category].productMap[productName]) {
          categoryMap[category].productMap[productName] = 0;
        }
        categoryMap[category].productMap[productName] += price;
      });

      // Convert to array and aggregate products
      const categories = Object.values(categoryMap).map(cat => ({
        category_name: cat.category_name,
        category_total: cat.category_total,
        products: Object.entries(cat.productMap).map(([name, total]) => ({
          product_name: name,
          product_total: total
        }))
      })).sort((a, b) => b.category_total - a.category_total);

      res.status(200).json(categories);
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

      // Get all expenses for the selected year
      const expensesQuery = `
        SELECT 
          category_name,
          product_name,
          price
        FROM expenses
        WHERE YEAR(created_at) = ?
          AND user_id = ?
        ORDER BY category_name, product_name
      `;

      const [expenseRows] = await db.execute(expensesQuery, [year, user_id]);

      // Group by category with products
      const categoryMap = {};
      let totalSpent = 0;

      expenseRows.forEach(row => {
        const category = row.category_name;
        const productName = row.product_name;
        const price = Number(row.price) || 0;
        totalSpent += price;

        if (!categoryMap[category]) {
          categoryMap[category] = {
            category_name: category,
            category_total: 0,
            productMap: {}
          };
        }

        categoryMap[category].category_total += price;
        
        // Aggregate products by name
        if (!categoryMap[category].productMap[productName]) {
          categoryMap[category].productMap[productName] = 0;
        }
        categoryMap[category].productMap[productName] += price;
      });

      // Convert to array and aggregate products
      const categories = Object.values(categoryMap).map(cat => ({
        category_name: cat.category_name,
        category_total: cat.category_total,
        products: Object.entries(cat.productMap).map(([name, total]) => ({
          product_name: name,
          product_total: total
        }))
      })).sort((a, b) => b.category_total - a.category_total);

      res.status(200).json(categories);
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

      const [rows] = await db.execute(query, [user_id]);

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

      const [result] = await db.execute(query, [expense_id]);

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
