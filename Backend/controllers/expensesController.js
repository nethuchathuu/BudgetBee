const db = require('../config/db');

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

      // Get category totals for the current date using created_at
      const categoryQuery = `
        SELECT 
          category_name,
          SUM(price) AS category_total
        FROM expenses
        WHERE DATE(created_at) = CURDATE()
          AND user_id = ?
        GROUP BY category_name
        ORDER BY category_total DESC
      `;

      const [categoryRows] = await db.execute(categoryQuery, [user_id]);

      // Calculate summary statistics with safe numeric conversion
      const totalSpent = categoryRows.reduce((sum, row) => {
        const amount = Number(row.category_total) || 0;
        return sum + amount;
      }, 0);
      const topCategory = categoryRows.length > 0 ? categoryRows[0].category_name : null;
      const topAmount = categoryRows.length > 0 ? (Number(categoryRows[0].category_total) || 0) : 0;
      
      // Format category breakdown for charts
      const categoryBreakdown = categoryRows.map(row => ({
        category: row.category_name,
        amount: Number(row.category_total) || 0,
        color: generateCategoryColor(row.category_name)
      }));

      res.status(200).json({
        success: true,
        data: {
          totalSpent,
          topCategory,
          topAmount,
          categoryBreakdown
        }
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

      // Get category totals for the selected date using created_at
      const categoryQuery = `
        SELECT 
          category_name,
          SUM(price) AS category_total
        FROM expenses
        WHERE DATE(created_at) = ?
          AND user_id = ?
        GROUP BY category_name
        ORDER BY category_total DESC
      `;

      const [categoryRows] = await db.execute(categoryQuery, [selected_date, user_id]);

      // Calculate summary statistics with safe numeric conversion
      const totalSpent = categoryRows.reduce((sum, row) => {
        const amount = Number(row.category_total) || 0;
        return sum + amount;
      }, 0);
      const topCategory = categoryRows.length > 0 ? categoryRows[0].category_name : null;
      const topAmount = categoryRows.length > 0 ? (Number(categoryRows[0].category_total) || 0) : 0;
      
      // Format category breakdown for charts
      const categoryBreakdown = categoryRows.map(row => ({
        category: row.category_name,
        amount: Number(row.category_total) || 0,
        color: generateCategoryColor(row.category_name)
      }));

      res.status(200).json({
        success: true,
        data: {
          totalSpent,
          topCategory,
          topAmount,
          categoryBreakdown
        }
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

      // Total spent this week
      const totalQuery = `SELECT IFNULL(SUM(price),0) AS totalSpent FROM expenses WHERE user_id = ? AND YEARWEEK(created_at,1) = YEARWEEK(CURDATE(),1);`;
      const [totalRows] = await db.execute(totalQuery, [user_id]);
      const totalSpent = Number(totalRows[0].totalSpent) || 0;

      if (totalSpent === 0) {
        return res.status(200).json({ success: true, message: 'No expenses recorded this week' });
      }

      // Category breakdown
      const breakdownQuery = `SELECT category_name, SUM(price) AS total FROM expenses WHERE user_id = ? AND YEARWEEK(created_at,1) = YEARWEEK(CURDATE(),1) GROUP BY category_name ORDER BY total DESC;`;
      const [breakdownRows] = await db.execute(breakdownQuery, [user_id]);
      const categoryBreakdown = breakdownRows.map(r => ({ category: r.category_name, amount: Number(r.total) || 0, color: generateCategoryColor(r.category_name) }));

      // Top category
      const topCat = categoryBreakdown.length > 0 ? { category: categoryBreakdown[0].category, amount: categoryBreakdown[0].amount } : { category: null, amount: 0 };

      // Highest day (group by date)
      const highestDayQuery = `SELECT DATE(created_at) AS date, SUM(price) AS total FROM expenses WHERE user_id = ? AND YEARWEEK(created_at,1) = YEARWEEK(CURDATE(),1) GROUP BY DATE(created_at) ORDER BY total DESC LIMIT 1;`;
      const [highestDayRows] = await db.execute(highestDayQuery, [user_id]);
      const highestDay = highestDayRows.length > 0 ? { date: highestDayRows[0].date, total: Number(highestDayRows[0].total) || 0 } : { date: null, total: 0 };

      // Daily average
      const dailyAverage = totalSpent / 7;

      res.status(200).json({
        success: true,
        data: {
          totalSpent,
          dailyAverage,
          highestDay,
          topCategory: topCat.category,
          topAmount: topCat.amount,
          categoryBreakdown
        }
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

      const totalQuery = `SELECT IFNULL(SUM(price),0) AS totalSpent FROM expenses WHERE user_id = ? AND YEARWEEK(created_at,1) = ?;`;
      const [totalRows] = await db.execute(totalQuery, [user_id, selected_week]);
      const totalSpent = Number(totalRows[0].totalSpent) || 0;

      if (totalSpent === 0) {
        return res.status(200).json({ success: true, message: 'No expenses recorded this week' });
      }

      const breakdownQuery = `SELECT category_name, SUM(price) AS total FROM expenses WHERE user_id = ? AND YEARWEEK(created_at,1) = ? GROUP BY category_name ORDER BY total DESC;`;
      const [breakdownRows] = await db.execute(breakdownQuery, [user_id, selected_week]);
      const categoryBreakdown = breakdownRows.map(r => ({ category: r.category_name, amount: Number(r.total) || 0, color: generateCategoryColor(r.category_name) }));

      const topCat = categoryBreakdown.length > 0 ? { category: categoryBreakdown[0].category, amount: categoryBreakdown[0].amount } : { category: null, amount: 0 };

      const highestDayQuery = `SELECT DATE(created_at) AS date, SUM(price) AS total FROM expenses WHERE user_id = ? AND YEARWEEK(created_at,1) = ? GROUP BY DATE(created_at) ORDER BY total DESC LIMIT 1;`;
      const [highestDayRows] = await db.execute(highestDayQuery, [user_id, selected_week]);
      const highestDay = highestDayRows.length > 0 ? { date: highestDayRows[0].date, total: Number(highestDayRows[0].total) || 0 } : { date: null, total: 0 };

      const dailyAverage = totalSpent / 7;

      res.status(200).json({ success: true, data: { totalSpent, dailyAverage, highestDay, topCategory: topCat.category, topAmount: topCat.amount, categoryBreakdown } });
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

      // Total spent this month
      const totalQuery = `SELECT IFNULL(SUM(price),0) AS totalSpent FROM expenses WHERE user_id = ? AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE());`;
      const [totalRows] = await db.execute(totalQuery, [user_id]);
      const totalSpent = Number(totalRows[0].totalSpent) || 0;

      if (totalSpent === 0) {
        return res.status(200).json({ success: true, message: 'No expenses recorded this month' });
      }

      // Days in current month
      const daysInMonthQuery = `SELECT DAY(LAST_DAY(CURDATE())) AS daysInMonth;`;
      const [daysRows] = await db.execute(daysInMonthQuery);
      const daysInMonth = daysRows[0].daysInMonth || 30;
      const dailyAverage = totalSpent / daysInMonth;

      // Weekly breakdown and average
      const weeklyBreakdownQuery = `SELECT WEEK(created_at,1) AS weekNum, SUM(price) AS weekTotal FROM expenses WHERE user_id = ? AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) GROUP BY weekNum ORDER BY weekTotal DESC;`;
      const [weeklyRows] = await db.execute(weeklyBreakdownQuery, [user_id]);
      const weeklyBreakdown = weeklyRows.map(r => ({ week: Number(r.weekNum), total: Number(r.weekTotal) || 0 }));
      const weeklyAverage = weeklyBreakdown.length > 0 ? weeklyBreakdown.reduce((sum, w) => sum + w.total, 0) / weeklyBreakdown.length : 0;

      // Highest week
      const highestWeek = weeklyBreakdown.length > 0 ? weeklyBreakdown[0] : { week: null, total: 0 };

      // Highest date
      const highestDateQuery = `SELECT DATE(created_at) AS date, SUM(price) AS total FROM expenses WHERE user_id = ? AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) GROUP BY DATE(created_at) ORDER BY total DESC LIMIT 1;`;
      const [highestDateRows] = await db.execute(highestDateQuery, [user_id]);
      const highestDate = highestDateRows.length > 0 ? { date: highestDateRows[0].date, total: Number(highestDateRows[0].total) || 0 } : { date: null, total: 0 };

      // Top category
      const topCategoryQuery = `SELECT category_name, SUM(price) AS total FROM expenses WHERE user_id = ? AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) GROUP BY category_name ORDER BY total DESC LIMIT 1;`;
      const [topCatRows] = await db.execute(topCategoryQuery, [user_id]);
      const topCategory = topCatRows.length > 0 ? { category: topCatRows[0].category_name, total: Number(topCatRows[0].total) || 0 } : { category: null, total: 0 };

      // Category breakdown
      const breakdownQuery = `SELECT category_name, SUM(price) AS total FROM expenses WHERE user_id = ? AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) GROUP BY category_name ORDER BY total DESC;`;
      const [breakdownRows] = await db.execute(breakdownQuery, [user_id]);
      const categoryBreakdown = breakdownRows.map(r => ({ category: r.category_name, amount: Number(r.total) || 0, color: generateCategoryColor(r.category_name) }));

      res.status(200).json({ 
        success: true, 
        data: { 
          totalSpent, 
          weeklyAverage, 
          dailyAverage, 
          highestWeek, 
          highestDate, 
          topCategory: topCategory.category, 
          topAmount: topCategory.total, 
          categoryBreakdown,
          weeklyBreakdown
        } 
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

      const totalQuery = `SELECT IFNULL(SUM(price),0) AS totalSpent FROM expenses WHERE user_id = ? AND YEAR(created_at) = ? AND MONTH(created_at) = ?;`;
      const [totalRows] = await db.execute(totalQuery, [user_id, year, month]);
      const totalSpent = Number(totalRows[0].totalSpent) || 0;

      if (totalSpent === 0) {
        return res.status(200).json({ success: true, message: 'No expenses recorded this month' });
      }

      // Days in selected month
      const daysInMonthQuery = `SELECT DAY(LAST_DAY(STR_TO_DATE(CONCAT(?, '-', ? , '-01'), '%Y-%m-%d'))) AS daysInMonth;`;
      const [daysRows] = await db.execute(daysInMonthQuery, [year, month]);
      const daysInMonth = daysRows[0].daysInMonth || 30;
      const dailyAverage = totalSpent / daysInMonth;

      // Weekly breakdown and average
      const weeklyBreakdownQuery = `SELECT WEEK(created_at,1) AS weekNum, SUM(price) AS weekTotal FROM expenses WHERE user_id = ? AND YEAR(created_at) = ? AND MONTH(created_at) = ? GROUP BY weekNum ORDER BY weekTotal DESC;`;
      const [weeklyRows] = await db.execute(weeklyBreakdownQuery, [user_id, year, month]);
      const weeklyBreakdown = weeklyRows.map(r => ({ week: Number(r.weekNum), total: Number(r.weekTotal) || 0 }));
      const weeklyAverage = weeklyBreakdown.length > 0 ? weeklyBreakdown.reduce((sum, w) => sum + w.total, 0) / weeklyBreakdown.length : 0;

      // Highest week
      const highestWeek = weeklyBreakdown.length > 0 ? weeklyBreakdown[0] : { week: null, total: 0 };

      // Highest date
      const highestDateQuery = `SELECT DATE(created_at) AS date, SUM(price) AS total FROM expenses WHERE user_id = ? AND YEAR(created_at) = ? AND MONTH(created_at) = ? GROUP BY DATE(created_at) ORDER BY total DESC LIMIT 1;`;
      const [highestDateRows] = await db.execute(highestDateQuery, [user_id, year, month]);
      const highestDate = highestDateRows.length > 0 ? { date: highestDateRows[0].date, total: Number(highestDateRows[0].total) || 0 } : { date: null, total: 0 };

      // Top category
      const topCategoryQuery = `SELECT category_name, SUM(price) AS total FROM expenses WHERE user_id = ? AND YEAR(created_at) = ? AND MONTH(created_at) = ? GROUP BY category_name ORDER BY total DESC LIMIT 1;`;
      const [topCatRows] = await db.execute(topCategoryQuery, [user_id, year, month]);
      const topCategory = topCatRows.length > 0 ? { category: topCatRows[0].category_name, total: Number(topCatRows[0].total) || 0 } : { category: null, total: 0 };

      // Category breakdown
      const breakdownQuery = `SELECT category_name, SUM(price) AS total FROM expenses WHERE user_id = ? AND YEAR(created_at) = ? AND MONTH(created_at) = ? GROUP BY category_name ORDER BY total DESC;`;
      const [breakdownRows] = await db.execute(breakdownQuery, [user_id, year, month]);
      const categoryBreakdown = breakdownRows.map(r => ({ category: r.category_name, amount: Number(r.total) || 0, color: generateCategoryColor(r.category_name) }));

      res.status(200).json({ 
        success: true, 
        data: { 
          totalSpent, 
          weeklyAverage, 
          dailyAverage, 
          highestWeek, 
          highestDate, 
          topCategory: topCategory.category, 
          topAmount: topCategory.total, 
          categoryBreakdown,
          weeklyBreakdown
        } 
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

      const totalQuery = `SELECT IFNULL(SUM(price),0) AS totalSpent FROM expenses WHERE user_id = ? AND YEAR(created_at) = YEAR(CURDATE());`;
      const [totalRows] = await db.execute(totalQuery, [user_id]);
      const totalSpent = Number(totalRows[0].totalSpent) || 0;

      if (totalSpent === 0) {
        return res.status(200).json({ success: true, message: 'No expenses recorded this year' });
      }

      // Daily average
      const dailyAverage = totalSpent / 365;

      // Monthly breakdown and average
      const monthlyBreakdownQuery = `SELECT MONTH(created_at) AS monthNumber, MONTHNAME(created_at) AS monthName, SUM(price) AS monthTotal FROM expenses WHERE user_id = ? AND YEAR(created_at) = YEAR(CURDATE()) GROUP BY monthNumber, monthName ORDER BY monthNumber;`;
      const [monthlyRows] = await db.execute(monthlyBreakdownQuery, [user_id]);
      const monthlyBreakdown = monthlyRows.map(r => ({ month: r.monthName, monthNumber: Number(r.monthNumber), total: Number(r.monthTotal) || 0 }));
      const monthlyAverage = monthlyBreakdown.length > 0 ? monthlyBreakdown.reduce((sum, m) => sum + m.total, 0) / monthlyBreakdown.length : 0;

      // Highest month
      const highestMonth = monthlyBreakdown.length > 0 ? monthlyBreakdown.reduce((prev, curr) => prev.total > curr.total ? prev : curr) : { month: null, total: 0 };

      // Weekly breakdown and average
      const weeklyBreakdownQuery = `SELECT WEEK(created_at,1) AS weekNum, SUM(price) AS weekTotal FROM expenses WHERE user_id = ? AND YEAR(created_at) = YEAR(CURDATE()) GROUP BY weekNum ORDER BY weekTotal DESC;`;
      const [weeklyRows] = await db.execute(weeklyBreakdownQuery, [user_id]);
      const weeklyBreakdown = weeklyRows.map(r => ({ week: Number(r.weekNum), total: Number(r.weekTotal) || 0 }));
      const weeklyAverage = weeklyBreakdown.length > 0 ? weeklyBreakdown.reduce((sum, w) => sum + w.total, 0) / weeklyBreakdown.length : 0;

      // Highest week
      const highestWeek = weeklyBreakdown.length > 0 ? weeklyBreakdown[0] : { week: null, total: 0 };

      // Highest date
      const highestDateQuery = `SELECT DATE(created_at) AS date, SUM(price) AS total FROM expenses WHERE user_id = ? AND YEAR(created_at) = YEAR(CURDATE()) GROUP BY DATE(created_at) ORDER BY total DESC LIMIT 1;`;
      const [highestDateRows] = await db.execute(highestDateQuery, [user_id]);
      const highestDate = highestDateRows.length > 0 ? { date: highestDateRows[0].date, total: Number(highestDateRows[0].total) || 0 } : { date: null, total: 0 };

      // Top category
      const topCategoryQuery = `SELECT category_name, SUM(price) AS total FROM expenses WHERE user_id = ? AND YEAR(created_at) = YEAR(CURDATE()) GROUP BY category_name ORDER BY total DESC LIMIT 1;`;
      const [topCatRows] = await db.execute(topCategoryQuery, [user_id]);
      const topCategory = topCatRows.length > 0 ? { category: topCatRows[0].category_name, total: Number(topCatRows[0].total) || 0 } : { category: null, total: 0 };

      // Category breakdown
      const breakdownQuery = `SELECT category_name, SUM(price) AS total FROM expenses WHERE user_id = ? AND YEAR(created_at) = YEAR(CURDATE()) GROUP BY category_name ORDER BY total DESC;`;
      const [breakdownRows] = await db.execute(breakdownQuery, [user_id]);
      const categoryBreakdown = breakdownRows.map(r => ({ category: r.category_name, amount: Number(r.total) || 0, color: generateCategoryColor(r.category_name) }));

      res.status(200).json({ 
        success: true, 
        data: { 
          totalSpent, 
          monthlyAverage, 
          weeklyAverage, 
          dailyAverage, 
          highestMonth, 
          highestWeek, 
          highestDate, 
          topCategory: topCategory.category, 
          topAmount: topCategory.total, 
          categoryBreakdown,
          monthlyBreakdown
        } 
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

      const totalQuery = `SELECT IFNULL(SUM(price),0) AS totalSpent FROM expenses WHERE user_id = ? AND YEAR(created_at) = ?;`;
      const [totalRows] = await db.execute(totalQuery, [user_id, year]);
      const totalSpent = Number(totalRows[0].totalSpent) || 0;

      if (totalSpent === 0) {
        return res.status(200).json({ success: true, message: 'No expenses recorded this year' });
      }

      // Daily average
      const dailyAverage = totalSpent / 365;

      // Monthly breakdown and average
      const monthlyBreakdownQuery = `SELECT MONTH(created_at) AS monthNumber, MONTHNAME(created_at) AS monthName, SUM(price) AS monthTotal FROM expenses WHERE user_id = ? AND YEAR(created_at) = ? GROUP BY monthNumber, monthName ORDER BY monthNumber;`;
      const [monthlyRows] = await db.execute(monthlyBreakdownQuery, [user_id, year]);
      const monthlyBreakdown = monthlyRows.map(r => ({ month: r.monthName, monthNumber: Number(r.monthNumber), total: Number(r.monthTotal) || 0 }));
      const monthlyAverage = monthlyBreakdown.length > 0 ? monthlyBreakdown.reduce((sum, m) => sum + m.total, 0) / monthlyBreakdown.length : 0;

      // Highest month
      const highestMonth = monthlyBreakdown.length > 0 ? monthlyBreakdown.reduce((prev, curr) => prev.total > curr.total ? prev : curr) : { month: null, total: 0 };

      // Weekly breakdown and average
      const weeklyBreakdownQuery = `SELECT WEEK(created_at,1) AS weekNum, SUM(price) AS weekTotal FROM expenses WHERE user_id = ? AND YEAR(created_at) = ? GROUP BY weekNum ORDER BY weekTotal DESC;`;
      const [weeklyRows] = await db.execute(weeklyBreakdownQuery, [user_id, year]);
      const weeklyBreakdown = weeklyRows.map(r => ({ week: Number(r.weekNum), total: Number(r.weekTotal) || 0 }));
      const weeklyAverage = weeklyBreakdown.length > 0 ? weeklyBreakdown.reduce((sum, w) => sum + w.total, 0) / weeklyBreakdown.length : 0;

      // Highest week
      const highestWeek = weeklyBreakdown.length > 0 ? weeklyBreakdown[0] : { week: null, total: 0 };

      // Highest date
      const highestDateQuery = `SELECT DATE(created_at) AS date, SUM(price) AS total FROM expenses WHERE user_id = ? AND YEAR(created_at) = ? GROUP BY DATE(created_at) ORDER BY total DESC LIMIT 1;`;
      const [highestDateRows] = await db.execute(highestDateQuery, [user_id, year]);
      const highestDate = highestDateRows.length > 0 ? { date: highestDateRows[0].date, total: Number(highestDateRows[0].total) || 0 } : { date: null, total: 0 };

      // Top category
      const topCategoryQuery = `SELECT category_name, SUM(price) AS total FROM expenses WHERE user_id = ? AND YEAR(created_at) = ? GROUP BY category_name ORDER BY total DESC LIMIT 1;`;
      const [topCatRows] = await db.execute(topCategoryQuery, [user_id, year]);
      const topCategory = topCatRows.length > 0 ? { category: topCatRows[0].category_name, total: Number(topCatRows[0].total) || 0 } : { category: null, total: 0 };

      // Category breakdown
      const breakdownQuery = `SELECT category_name, SUM(price) AS total FROM expenses WHERE user_id = ? AND YEAR(created_at) = ? GROUP BY category_name ORDER BY total DESC;`;
      const [breakdownRows] = await db.execute(breakdownQuery, [user_id, year]);
      const categoryBreakdown = breakdownRows.map(r => ({ category: r.category_name, amount: Number(r.total) || 0, color: generateCategoryColor(r.category_name) }));

      res.status(200).json({ 
        success: true, 
        data: { 
          totalSpent, 
          monthlyAverage, 
          weeklyAverage, 
          dailyAverage, 
          highestMonth, 
          highestWeek, 
          highestDate, 
          topCategory: topCategory.category, 
          topAmount: topCategory.total, 
          categoryBreakdown,
          monthlyBreakdown
        } 
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
