import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, DollarSign, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

export default function NotLimit() {
  const { isDark } = useTheme();
  const toast = useToast();

  // Individual states for limits initialized to '0' as requested
  const [dailyLimit, setDailyLimit] = useState('0');
  const [weeklyLimit, setWeeklyLimit] = useState('0');
  const [monthlyLimit, setMonthlyLimit] = useState('0');
  const [yearlyLimit, setYearlyLimit] = useState('0');

  // Settings state for booleans and threshold
  const [settings, setSettings] = useState({
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
        // Ensure defaults from API are converted to strings
        setDailyLimit(String(response.data.daily_limit ?? 0));
        setWeeklyLimit(String(response.data.weekly_limit ?? 0));
        setMonthlyLimit(String(response.data.monthly_limit ?? 0));
        setYearlyLimit(String(response.data.yearly_limit ?? 0));

        setSettings({
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
        const parsed = JSON.parse(saved);
        setDailyLimit(String(parsed.dailyLimit ?? 0));
        setWeeklyLimit(String(parsed.weeklyLimit ?? 0));
        setMonthlyLimit(String(parsed.monthlyLimit ?? 0));
        setYearlyLimit(String(parsed.yearlyLimit ?? 0));
        
        setSettings(prev => ({
          ...prev,
          enableDailyAlerts: parsed.enableDailyAlerts ?? true,
          enableWeeklyAlerts: parsed.enableWeeklyAlerts ?? true,
          enableMonthlyAlerts: parsed.enableMonthlyAlerts ?? true,
          enableYearlyAlerts: parsed.enableYearlyAlerts ?? true,
          alertThreshold: parsed.alertThreshold ?? 80
        }));
      }
    }
  };

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLimitChange = (setter) => (e) => {
    let value = e.target.value;

    // Allow empty string so user can erase 0
    if (value === '') {
      setter('');
      return;
    }

    // Block non-numbers
    if (!/^\d*(\.\d{0,2})?$/.test(value)) return;

    // Remove leading zeroes (except decimal values like 0.50)
    if (value.length > 1 && value.startsWith('0') && !value.startsWith('0.')) {
      value = value.replace(/^0+/, '');
    }

    setter(value);
  };

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem('user_id') || 1;
      const token = localStorage.getItem('token');
      
      // Prepare data, converting empty strings to 0
      const dataToSave = {
        user_id: userId,
        daily_limit: dailyLimit === '' ? 0 : dailyLimit,
        weekly_limit: weeklyLimit === '' ? 0 : weeklyLimit,
        monthly_limit: monthlyLimit === '' ? 0 : monthlyLimit,
        yearly_limit: yearlyLimit === '' ? 0 : yearlyLimit,
        alert_threshold: settings.alertThreshold
      };
      
      // Save to database
      await axios.post('http://localhost:5000/api/limits', dataToSave, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update state with sanitized values
      setDailyLimit(String(dataToSave.daily_limit));
      setWeeklyLimit(String(dataToSave.weekly_limit));
      setMonthlyLimit(String(dataToSave.monthly_limit));
      setYearlyLimit(String(dataToSave.yearly_limit));
      
      // Save to localStorage as backup
      const storageData = {
        dailyLimit: dataToSave.daily_limit,
        weeklyLimit: dataToSave.weekly_limit,
        monthlyLimit: dataToSave.monthly_limit,
        yearlyLimit: dataToSave.yearly_limit,
        ...settings
      };
      localStorage.setItem('budgetbee-notification-limits', JSON.stringify(storageData));
      
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
      const storageData = {
        dailyLimit: dailyLimit === '' ? 0 : dailyLimit,
        weeklyLimit: weeklyLimit === '' ? 0 : weeklyLimit,
        monthlyLimit: monthlyLimit === '' ? 0 : monthlyLimit,
        yearlyLimit: yearlyLimit === '' ? 0 : yearlyLimit,
        ...settings
      };
      localStorage.setItem('budgetbee-notification-limits', JSON.stringify(storageData));
      toast.show('Limits saved locally', 'success');
    }
  };

  const handleReset = async () => {
    setDailyLimit('0');
    setWeeklyLimit('0');
    setMonthlyLimit('0');
    setYearlyLimit('0');
    
    const defaultSettings = {
      enableDailyAlerts: true,
      enableWeeklyAlerts: true,
      enableMonthlyAlerts: true,
      enableYearlyAlerts: true,
      alertThreshold: 80
    };
    setSettings(defaultSettings);
    
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
      
      const storageData = {
        dailyLimit: 0,
        weeklyLimit: 0,
        monthlyLimit: 0,
        yearlyLimit: 0,
        ...defaultSettings
      };
      localStorage.setItem('budgetbee-notification-limits', JSON.stringify(storageData));
      toast.show('Notification limits reset to defaults', 'info');
    } catch (error) {
      console.error('Error resetting limits:', error);
      const storageData = {
        dailyLimit: 0,
        weeklyLimit: 0,
        monthlyLimit: 0,
        yearlyLimit: 0,
        ...defaultSettings
      };
      localStorage.setItem('budgetbee-notification-limits', JSON.stringify(storageData));
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
                checked={settings.enableDailyAlerts}
                onChange={(e) => handleSettingChange('enableDailyAlerts', e.target.checked)}
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
              type="text"
              value={dailyLimit}
              onChange={handleLimitChange(setDailyLimit)}
              placeholder="Enter limit amount"
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
                checked={settings.enableWeeklyAlerts}
                onChange={(e) => handleSettingChange('enableWeeklyAlerts', e.target.checked)}
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
              type="text"
              value={weeklyLimit}
              onChange={handleLimitChange(setWeeklyLimit)}
              placeholder="Enter limit amount"
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
                checked={settings.enableMonthlyAlerts}
                onChange={(e) => handleSettingChange('enableMonthlyAlerts', e.target.checked)}
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
              type="text"
              value={monthlyLimit}
              onChange={handleLimitChange(setMonthlyLimit)}
              placeholder="Enter limit amount"
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
                checked={settings.enableYearlyAlerts}
                onChange={(e) => handleSettingChange('enableYearlyAlerts', e.target.checked)}
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
              type="text"
              value={yearlyLimit}
              onChange={handleLimitChange(setYearlyLimit)}
              placeholder="Enter limit amount"
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
              value={settings.alertThreshold}
              onChange={(e) => handleSettingChange('alertThreshold', Number(e.target.value))}
              className="flex-1"
            />
            <span className={`text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-500'} min-w-[70px]`}>
              {settings.alertThreshold}%
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
