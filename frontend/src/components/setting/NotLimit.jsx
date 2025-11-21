import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, DollarSign, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

export default function NotLimit() {
  const { isDark } = useTheme();
  const toast = useToast();

  const [limits, setLimits] = useState({
    dailyLimit: 0,
    weeklyLimit: 0,
    monthlyLimit: 0,
    yearlyLimit: 0,
    enableDailyAlerts: true,
    enableWeeklyAlerts: true,
    enableMonthlyAlerts: true,
    enableYearlyAlerts: true,
    alertThreshold: 80
  });

  useEffect(() => {
    loadLimits();
  }, []);

  const loadLimits = async () => {
    try {
      const userId = localStorage.getItem('user_id') || 1;
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:5000/api/limits/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setLimits({
          dailyLimit: response.data.daily_limit || 0,
          weeklyLimit: response.data.weekly_limit || 0,
          monthlyLimit: response.data.monthly_limit || 0,
          yearlyLimit: response.data.yearly_limit || 0,
          enableDailyAlerts: true,
          enableWeeklyAlerts: true,
          enableMonthlyAlerts: true,
          enableYearlyAlerts: true,
          alertThreshold: response.data.alert_threshold || 80
        });
      }
    } catch (error) {
      console.error('Error loading limits:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('budgetbee-notification-limits');
      if (saved) {
        setLimits(JSON.parse(saved));
      }
    }
  };

  const handleLimitChange = (field, value) => {
    setLimits(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem('user_id') || 1;
      const token = localStorage.getItem('token');
      
      // Save to database
      await axios.post('http://localhost:5000/api/limits', {
        user_id: userId,
        daily_limit: limits.dailyLimit,
        weekly_limit: limits.weeklyLimit,
        monthly_limit: limits.monthlyLimit,
        yearly_limit: limits.yearlyLimit,
        alert_threshold: limits.alertThreshold
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Save to localStorage as backup
      localStorage.setItem('budgetbee-notification-limits', JSON.stringify(limits));
      
      // Trigger limit check
      await axios.post('http://localhost:5000/api/limits/check', {
        user_id: userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.show('Notification limits saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving limits:', error);
      // Fallback to localStorage only
      localStorage.setItem('budgetbee-notification-limits', JSON.stringify(limits));
      toast.show('Limits saved locally', 'success');
    }
  };

  const handleReset = async () => {
    const defaults = {
      dailyLimit: 0,
      weeklyLimit: 0,
      monthlyLimit: 0,
      yearlyLimit: 0,
      enableDailyAlerts: true,
      enableWeeklyAlerts: true,
      enableMonthlyAlerts: true,
      enableYearlyAlerts: true,
      alertThreshold: 80
    };
    setLimits(defaults);
    
    try {
      const userId = localStorage.getItem('user_id') || 1;
      const token = localStorage.getItem('token');
      
      await axios.post('http://localhost:5000/api/limits', {
        user_id: userId,
        daily_limit: 0,
        weekly_limit: 0,
        monthly_limit: 0,
        yearly_limit: 0,
        alert_threshold: 80
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.setItem('budgetbee-notification-limits', JSON.stringify(defaults));
      toast.show('Notification limits reset to defaults', 'info');
    } catch (error) {
      console.error('Error resetting limits:', error);
      localStorage.setItem('budgetbee-notification-limits', JSON.stringify(defaults));
      toast.show('Limits reset locally', 'info');
    }
  };

  return (
    <div className={`${isDark ? 'bg-[#1a1f2c]' : 'bg-white'} rounded-xl shadow-lg p-8`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Bell className={`h-8 w-8 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Notification Limits
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Set budget alert limits to manage your spending
          </p>
        </div>
      </div>

      {/* Budget Limits */}
      <div className="space-y-6 mb-8">
        {/* Daily Limit */}
        <div className={`p-6 rounded-lg ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <DollarSign className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Daily Limit
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={limits.enableDailyAlerts}
                onChange={(e) => handleLimitChange('enableDailyAlerts', e.target.checked)}
                className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400"
              />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Enable alerts
              </span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Rs.</span>
            <input
              type="number"
              value={limits.dailyLimit}
              onChange={(e) => handleLimitChange('dailyLimit', Number(e.target.value))}
              className={`
                flex-1 px-4 py-3 rounded-lg text-lg font-semibold outline-none border-2
                ${isDark 
                  ? 'bg-[#1a1f2c] text-white border-gray-700 focus:border-emerald-400' 
                  : 'bg-white text-gray-800 border-gray-300 focus:border-emerald-500'
                }
              `}
            />
          </div>
        </div>

        {/* Weekly Limit */}
        <div className={`p-6 rounded-lg ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <DollarSign className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Weekly Limit
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={limits.enableWeeklyAlerts}
                onChange={(e) => handleLimitChange('enableWeeklyAlerts', e.target.checked)}
                className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400"
              />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Enable alerts
              </span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Rs.</span>
            <input
              type="number"
              value={limits.weeklyLimit}
              onChange={(e) => handleLimitChange('weeklyLimit', Number(e.target.value))}
              className={`
                flex-1 px-4 py-3 rounded-lg text-lg font-semibold outline-none border-2
                ${isDark 
                  ? 'bg-[#1a1f2c] text-white border-gray-700 focus:border-emerald-400' 
                  : 'bg-white text-gray-800 border-gray-300 focus:border-emerald-500'
                }
              `}
            />
          </div>
        </div>

        {/* Monthly Limit */}
        <div className={`p-6 rounded-lg ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <DollarSign className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Monthly Limit
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={limits.enableMonthlyAlerts}
                onChange={(e) => handleLimitChange('enableMonthlyAlerts', e.target.checked)}
                className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400"
              />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Enable alerts
              </span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Rs.</span>
            <input
              type="number"
              value={limits.monthlyLimit}
              onChange={(e) => handleLimitChange('monthlyLimit', Number(e.target.value))}
              className={`
                flex-1 px-4 py-3 rounded-lg text-lg font-semibold outline-none border-2
                ${isDark 
                  ? 'bg-[#1a1f2c] text-white border-gray-700 focus:border-emerald-400' 
                  : 'bg-white text-gray-800 border-gray-300 focus:border-emerald-500'
                }
              `}
            />
          </div>
        </div>

        {/* Yearly Limit */}
        <div className={`p-6 rounded-lg ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <DollarSign className={`h-5 w-5 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Yearly Limit
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={limits.enableYearlyAlerts}
                onChange={(e) => handleLimitChange('enableYearlyAlerts', e.target.checked)}
                className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-400"
              />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Enable alerts
              </span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Rs.</span>
            <input
              type="number"
              value={limits.yearlyLimit}
              onChange={(e) => handleLimitChange('yearlyLimit', Number(e.target.value))}
              className={`
                flex-1 px-4 py-3 rounded-lg text-lg font-semibold outline-none border-2
                ${isDark 
                  ? 'bg-[#1a1f2c] text-white border-gray-700 focus:border-emerald-400' 
                  : 'bg-white text-gray-800 border-gray-300 focus:border-emerald-500'
                }
              `}
            />
          </div>
        </div>

        {/* Alert Threshold */}
        <div className={`p-6 rounded-lg ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className={`h-5 w-5 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Alert Threshold
            </h3>
          </div>
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Get notified when you reach this percentage of your limit
          </p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={limits.alertThreshold}
              onChange={(e) => handleLimitChange('alertThreshold', Number(e.target.value))}
              className="flex-1"
            />
            <span className={`text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-500'} min-w-[70px]`}>
              {limits.alertThreshold}%
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Save className="h-5 w-5" />
          Save Changes
        </button>
        <button
          onClick={handleReset}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-colors
            ${isDark 
              ? 'bg-[#0c111c] text-white hover:bg-[#1a1f2c]' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }
          `}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
