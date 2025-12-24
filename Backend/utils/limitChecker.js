const axios = require('axios');
const db = require('../config/db');

// Check if a notification already exists for today for this limit type
const checkNotificationExists = async (userId, type) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const query = `
      SELECT * FROM notifications
      WHERE user_id = ?
        AND type = ?
        AND DATE(timestamp) = CURDATE()
    `;
    
    const [notifications] = await db.execute(query, [userId, type]);
    return notifications.length > 0;
  } catch (error) {
    console.error('Error checking notification existence:', error);
    return false;
  }
};

// Create notification
const createNotification = async (userId, title, message, type) => {
  try {
    // Check if notification already exists for today
    const exists = await checkNotificationExists(userId, type);
    if (exists) {
      console.log(`Notification already exists for ${type} limit today`);
      return;
    }

    const query = `
      INSERT INTO notifications (user_id, title, message, type, timestamp, isRead)
      VALUES (?, ?, ?, ?, NOW(), false)
    `;

    await db.execute(query, [userId, title, message, type]);
    console.log(`Notification created for user ${userId}: ${title}`);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Check daily limit
const checkDailyLimit = async (userId, dailyLimit, todayTotal) => {
  if (!dailyLimit || dailyLimit <= 0) return;
  
  if (todayTotal > dailyLimit) {
    const title = "Daily Spending Limit Exceeded! 📅";
    const message = `You have exceeded your daily spending limit of Rs. ${dailyLimit.toLocaleString()}. Today's spending: Rs. ${todayTotal.toLocaleString()}`;
    await createNotification(userId, title, message, 'daily');
  }
};

// Check weekly limit
const checkWeeklyLimit = async (userId, weeklyLimit, weekTotal) => {
  if (!weeklyLimit || weeklyLimit <= 0) return;
  
  if (weekTotal > weeklyLimit) {
    const title = "Weekly Spending Limit Exceeded! 📊";
    const message = `Your weekly spending limit of Rs. ${weeklyLimit.toLocaleString()} has been passed! This week's spending: Rs. ${weekTotal.toLocaleString()}`;
    await createNotification(userId, title, message, 'weekly');
  }
};

// Check monthly limit
const checkMonthlyLimit = async (userId, monthlyLimit, monthTotal) => {
  if (!monthlyLimit || monthlyLimit <= 0) return;
  
  if (monthTotal > monthlyLimit) {
    const title = "Monthly Budget Exceeded! 📈";
    const message = `Your monthly budget of Rs. ${monthlyLimit.toLocaleString()} has been exceeded! This month's spending: Rs. ${monthTotal.toLocaleString()}`;
    await createNotification(userId, title, message, 'monthly');
  }
};

// Check yearly limit
const checkYearlyLimit = async (userId, yearlyLimit, yearTotal) => {
  if (!yearlyLimit || yearlyLimit <= 0) return;
  
  if (yearTotal > yearlyLimit) {
    const title = "Yearly Budget Limit Reached! 🎯";
    const message = `Your yearly budget limit of Rs. ${yearlyLimit.toLocaleString()} has been reached! This year's spending: Rs. ${yearTotal.toLocaleString()}`;
    await createNotification(userId, title, message, 'yearly');
  }
};

// Main function to check all limits
const checkAllLimits = async (userId, limits, totals) => {
  try {
    const { 
      dailyLimit, weeklyLimit, monthlyLimit, yearlyLimit,
      enableDailyAlerts, enableWeeklyAlerts, enableMonthlyAlerts, enableYearlyAlerts
    } = limits;
    const { dailyTotal, weeklyTotal, monthlyTotal, yearlyTotal } = totals;

    const checks = [];
    if (enableDailyAlerts) checks.push(checkDailyLimit(userId, dailyLimit, dailyTotal));
    if (enableWeeklyAlerts) checks.push(checkWeeklyLimit(userId, weeklyLimit, weeklyTotal));
    if (enableMonthlyAlerts) checks.push(checkMonthlyLimit(userId, monthlyLimit, monthlyTotal));
    if (enableYearlyAlerts) checks.push(checkYearlyLimit(userId, yearlyLimit, yearlyTotal));

    await Promise.all(checks);
  } catch (error) {
    console.error('Error checking limits:', error);
  }
};

// Get user limits from database
const getUserLimits = async (userId) => {
  try {
    const query = `
      SELECT *
      FROM user_limits
      WHERE user_id = ?
    `;
    
    const [rows] = await db.execute(query, [userId]);
    
    if (rows.length > 0) {
      return {
        dailyLimit: rows[0].daily_limit,
        weeklyLimit: rows[0].weekly_limit,
        monthlyLimit: rows[0].monthly_limit,
        yearlyLimit: rows[0].yearly_limit,
        enableDailyAlerts: !!rows[0].enable_daily_alerts,
        enableWeeklyAlerts: !!rows[0].enable_weekly_alerts,
        enableMonthlyAlerts: !!rows[0].enable_monthly_alerts,
        enableYearlyAlerts: !!rows[0].enable_yearly_alerts
      };
    }
    
    return { 
      dailyLimit: 0, weeklyLimit: 0, monthlyLimit: 0, yearlyLimit: 0,
      enableDailyAlerts: true, enableWeeklyAlerts: true, enableMonthlyAlerts: true, enableYearlyAlerts: true
    };
  } catch (error) {
    console.error('Error getting user limits:', error);
    return { 
      dailyLimit: 0, weeklyLimit: 0, monthlyLimit: 0, yearlyLimit: 0,
      enableDailyAlerts: true, enableWeeklyAlerts: true, enableMonthlyAlerts: true, enableYearlyAlerts: true
    };
  }
};

// Get spending totals
const getSpendingTotals = async (userId) => {
  try {
    // Daily total
    const dailyQuery = `
      SELECT IFNULL(SUM(price), 0) as total
      FROM expenses
      WHERE user_id = ? AND DATE(created_at) = CURDATE()
    `;
    const [dailyRows] = await db.execute(dailyQuery, [userId]);
    
    // Weekly total
    const weeklyQuery = `
      SELECT IFNULL(SUM(price), 0) as total
      FROM expenses
      WHERE user_id = ? AND YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)
    `;
    const [weeklyRows] = await db.execute(weeklyQuery, [userId]);
    
    // Monthly total
    const monthlyQuery = `
      SELECT IFNULL(SUM(price), 0) as total
      FROM expenses
      WHERE user_id = ?
        AND MONTH(created_at) = MONTH(CURDATE())
        AND YEAR(created_at) = YEAR(CURDATE())
    `;
    const [monthlyRows] = await db.execute(monthlyQuery, [userId]);
    
    // Yearly total
    const yearlyQuery = `
      SELECT IFNULL(SUM(price), 0) as total
      FROM expenses
      WHERE user_id = ? AND YEAR(created_at) = YEAR(CURDATE())
    `;
    const [yearlyRows] = await db.execute(yearlyQuery, [userId]);
    
    return {
      dailyTotal: Number(dailyRows[0].total) || 0,
      weeklyTotal: Number(weeklyRows[0].total) || 0,
      monthlyTotal: Number(monthlyRows[0].total) || 0,
      yearlyTotal: Number(yearlyRows[0].total) || 0
    };
  } catch (error) {
    console.error('Error getting spending totals:', error);
    return { dailyTotal: 0, weeklyTotal: 0, monthlyTotal: 0, yearlyTotal: 0 };
  }
};

// Main function to run limit checks
const runLimitChecks = async (userId) => {
  try {
    const limits = await getUserLimits(userId);
    const totals = await getSpendingTotals(userId);
    
    await checkAllLimits(userId, limits, totals);
  } catch (error) {
    console.error('Error running limit checks:', error);
  }
};

module.exports = {
  runLimitChecks,
  checkAllLimits,
  getUserLimits,
  getSpendingTotals
};
