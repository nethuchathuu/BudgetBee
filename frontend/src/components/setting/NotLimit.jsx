import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, DollarSign, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

export default function NotLimit() {
  const { isDark } = useTheme();
  const toast = useToast();

  const [limits, setLimits] = useState(() => {
    const saved = localStorage.getItem('budgetbee-notification-limits');
    return saved ? JSON.parse(saved) : {
      dailyLimit: 1000,
      weeklyLimit: 5000,
      monthlyLimit: 20000,
      enableDailyAlerts: true,
      enableWeeklyAlerts: true,
      enableMonthlyAlerts: true,
      alertThreshold: 80 // Percentage
    };
  });

  const handleLimitChange = (field, value) => {
    setLimits(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem('budgetbee-notification-limits', JSON.stringify(limits));
    toast.show('Notification limits saved successfully!', 'success');
  };

  const handleReset = () => {
    const defaults = {
      dailyLimit: 1000,
      weeklyLimit: 5000,
      monthlyLimit: 20000,
      enableDailyAlerts: true,
      enableWeeklyAlerts: true,
      enableMonthlyAlerts: true,
      alertThreshold: 80
    };
    setLimits(defaults);
    localStorage.setItem('budgetbee-notification-limits', JSON.stringify(defaults));
    toast.show('Notification limits reset to defaults', 'info');
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
