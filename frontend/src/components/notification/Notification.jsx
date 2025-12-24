import React, { useState, useEffect } from 'react';
import { Bell, Trash2, Check, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import NavProfile from '../NavProfile';

const Notification = () => {
  const { theme, isDark } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // New States for Limits and Spending
  const [dailyLimit, setDailyLimit] = useState(0);
  const [weeklyLimit, setWeeklyLimit] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(0);
  const [yearlyLimit, setYearlyLimit] = useState(0);

  const [enableDailyAlerts, setEnableDailyAlerts] = useState(true);
  const [enableWeeklyAlerts, setEnableWeeklyAlerts] = useState(true);
  const [enableMonthlyAlerts, setEnableMonthlyAlerts] = useState(true);
  const [enableYearlyAlerts, setEnableYearlyAlerts] = useState(true);

  const [dailySpent, setDailySpent] = useState(0);
  const [weeklySpent, setWeeklySpent] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [yearlySpent, setYearlySpent] = useState(0);

  const [hasNotifiedDaily, setHasNotifiedDaily] = useState(false);
  const [hasNotifiedWeekly, setHasNotifiedWeekly] = useState(false);
  const [hasNotifiedMonthly, setHasNotifiedMonthly] = useState(false);
  const [hasNotifiedYearly, setHasNotifiedYearly] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchLimits();
    fetchSpending();
  }, []);

  useEffect(() => {
    setHasNotifiedDaily(false);
    setHasNotifiedWeekly(false);
    setHasNotifiedMonthly(false);
    setHasNotifiedYearly(false);
  }, [dailyLimit, weeklyLimit, monthlyLimit, yearlyLimit]);

  useEffect(() => {
    checkLimits();
  }, [dailySpent, weeklySpent, monthlySpent, yearlySpent, dailyLimit, weeklyLimit, monthlyLimit, yearlyLimit, hasNotifiedDaily, hasNotifiedWeekly, hasNotifiedMonthly, hasNotifiedYearly, enableDailyAlerts, enableWeeklyAlerts, enableMonthlyAlerts, enableYearlyAlerts]);

  const fetchLimits = async () => {
    try {
      const userId = localStorage.getItem('user_id') || 1;
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/limits/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setDailyLimit(response.data.daily_limit || 0);
        setWeeklyLimit(response.data.weekly_limit || 0);
        setMonthlyLimit(response.data.monthly_limit || 0);
        setYearlyLimit(response.data.yearly_limit || 0);
        
        // Helper to safely parse boolean/integer flags, defaulting to true
        const isEnabled = (val) => val !== 0 && val !== false;

        setEnableDailyAlerts(isEnabled(response.data.enable_daily_alerts));
        setEnableWeeklyAlerts(isEnabled(response.data.enable_weekly_alerts));
        setEnableMonthlyAlerts(isEnabled(response.data.enable_monthly_alerts));
        setEnableYearlyAlerts(isEnabled(response.data.enable_yearly_alerts));
      }
    } catch (error) {
      console.error('Error fetching limits:', error);
    }
  };

  const fetchSpending = async () => {
    try {
      const userId = localStorage.getItem('user_id') || 1;
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/expense/totals/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDailySpent(res.data.daily ?? 0);
      setWeeklySpent(res.data.weekly ?? 0);
      setMonthlySpent(res.data.monthly ?? 0);
      setYearlySpent(res.data.yearly ?? 0);
    } catch (error) {
      console.error('Error fetching spending:', error);
    }
  };

  const createNotification = async (data) => {
    try {
      const userId = localStorage.getItem('user_id') || 1;
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/notifications', {
        user_id: userId,
        ...data
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const sendNotification = (type, limit, spent) => {
    createNotification({
      title: `${type} Spending Limit Exceeded! 📊`,
      message: `Your ${type.toLowerCase()} spending limit of Rs. ${limit.toFixed(2)} has been passed! This ${type.toLowerCase()}'s spending: Rs. ${spent.toFixed(2)}`,
      type: 'alert'
    });
  };

  const checkLimits = () => {
    if (enableDailyAlerts && dailyLimit > 0 && dailySpent > dailyLimit && !hasNotifiedDaily) {
      sendNotification('Daily', dailyLimit, dailySpent);
      setHasNotifiedDaily(true);
    }

    if (enableWeeklyAlerts && weeklyLimit > 0 && weeklySpent > weeklyLimit && !hasNotifiedWeekly) {
      sendNotification('Weekly', weeklyLimit, weeklySpent);
      setHasNotifiedWeekly(true);
    }

    if (enableMonthlyAlerts && monthlyLimit > 0 && monthlySpent > monthlyLimit && !hasNotifiedMonthly) {
      sendNotification('Monthly', monthlyLimit, monthlySpent);
      setHasNotifiedMonthly(true);
    }

    if (enableYearlyAlerts && yearlyLimit > 0 && yearlySpent > yearlyLimit && !hasNotifiedYearly) {
      sendNotification('Yearly', yearlyLimit, yearlySpent);
      setHasNotifiedYearly(true);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('user_id') || 1;
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:5000/api/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to localStorage if backend fails
      const localNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      setNotifications(localNotifications);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      
      // Update localStorage fallback
      const localNotifications = notifications.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      );
      localStorage.setItem('notifications', JSON.stringify(localNotifications));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Update localStorage on error
      const localNotifications = notifications.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      );
      setNotifications(localNotifications);
      localStorage.setItem('notifications', JSON.stringify(localNotifications));
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      // Update localStorage fallback
      const localNotifications = notifications.filter(notif => notif.id !== notificationId);
      localStorage.setItem('notifications', JSON.stringify(localNotifications));
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Update localStorage on error
      const localNotifications = notifications.filter(notif => notif.id !== notificationId);
      setNotifications(localNotifications);
      localStorage.setItem('notifications', JSON.stringify(localNotifications));
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    for (const notif of unreadNotifications) {
      await markAsRead(notif.id);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      const userId = localStorage.getItem('user_id') || 1;
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notifications/deleteAll/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications([]);
      localStorage.setItem('notifications', '[]');
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      // Fallback for demo/local
      setNotifications([]);
      localStorage.setItem('notifications', '[]');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'daily':
        return '📅';
      case 'weekly':
        return '📊';
      case 'monthly':
        return '📈';
      case 'yearly':
        return '🎯';
      default:
        return '🔔';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <>
        <NavProfile />
        <div className={`min-h-screen pt-20 flex items-center justify-center ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading notifications...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavProfile />
      <div className={`min-h-screen pt-20 ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'} py-8 px-4`}>
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className={`mb-4 flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            isDark
              ? 'bg-[#1a1f2c] text-emerald-400 hover:bg-[#252b3d]'
              : 'bg-white text-emerald-600 hover:bg-gray-50'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Header */}
        <div className={`rounded-2xl p-6 mb-6 backdrop-blur-md ${
          isDark 
            ? 'bg-[#1a1f2c]/80 border border-emerald-400/20' 
            : 'bg-white/80 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <Bell className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Notifications
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isDark
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                >
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={deleteAllNotifications}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-[#ff5252] text-white hover:bg-[#ff3030]"
                >
                  Delete All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className={`rounded-2xl p-12 text-center backdrop-blur-md ${
              isDark 
                ? 'bg-[#1a1f2c]/60 border border-emerald-400/10' 
                : 'bg-white/60 border border-gray-200'
            }`}>
              <Bell className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                No notifications yet
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                You'll be notified when you exceed your spending limits
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-xl p-4 backdrop-blur-md transition-all ${
                  notification.isRead
                    ? isDark
                      ? 'bg-[#1a1f2c]/60 border border-gray-700/50'
                      : 'bg-white/60 border border-gray-200'
                    : isDark
                    ? 'bg-[#1a1f2c]/80 border-2 border-emerald-400/30 shadow-lg shadow-emerald-500/10'
                    : 'bg-white/80 border-2 border-emerald-400/50 shadow-lg shadow-emerald-500/10'
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${
                          notification.isRead
                            ? isDark ? 'text-gray-300' : 'text-gray-700'
                            : isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm mb-2 ${
                          notification.isRead
                            ? isDark ? 'text-gray-500' : 'text-gray-500'
                            : isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-shrink-0">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className={`p-2 rounded-lg transition-all ${
                              isDark
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            }`}
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className={`p-2 rounded-lg transition-all ${
                            isDark
                              ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Notification;
