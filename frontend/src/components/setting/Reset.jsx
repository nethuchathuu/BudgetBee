import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, Trash2, CheckCircle, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

export default function Reset() {
  const { isDark } = useTheme();
  const toast = useToast();
  const [showFullResetModal, setShowFullResetModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const resetPreferences = () => {
    try {
      // Clear UI settings from localStorage
      localStorage.removeItem('budgetbee-theme');
      localStorage.removeItem('budgetbee-default-dashboard');
      localStorage.removeItem('budgetbee-notification-limits');
      localStorage.removeItem('budgetbee-summary-filters');
      
      toast.show('Preferences reset successfully!', 'success');
      
      // Reload page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.show('Failed to reset preferences', 'error');
    }
  };

  const clearLocalCache = () => {
    try {
      // Clear cached data
      localStorage.removeItem('budgetbee-cached-summaries');
      localStorage.removeItem('budgetbee-cached-receipts');
      localStorage.removeItem('budgetbee-temp-state');
      
      // Clear browser cache if available
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
      
      toast.show('Cache cleared successfully!', 'success');
    } catch (error) {
      toast.show('Failed to clear cache', 'error');
    }
  };

  const openFullResetModal = () => {
    setShowFullResetModal(true);
    setPassword('');
  };

  const closeFullResetModal = () => {
    setShowFullResetModal(false);
    setPassword('');
    setIsResetting(false);
  };

  const performFullReset = async () => {
    if (!password) {
      toast.show('Please enter your password to confirm', 'error');
      return;
    }

    try {
      setIsResetting(true);

      // Validate password with backend
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/auth/verify-password',
        { password },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Clear ALL localStorage keys for BudgetBee
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('budgetbee-')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Clear cached items
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }

        // Clear indexedDB if used
        if (window.indexedDB) {
          const dbs = await window.indexedDB.databases();
          dbs.forEach(db => {
            if (db.name && db.name.includes('budgetbee')) {
              window.indexedDB.deleteDatabase(db.name);
            }
          });
        }

        toast.show('All local data has been reset successfully!', 'success');
        closeFullResetModal();

        // Reload page to apply changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.show('Invalid password. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Reset error:', error);
      if (error.response && error.response.status === 401) {
        toast.show('Invalid password. Please try again.', 'error');
      } else {
        toast.show('Failed to reset data. Please try again.', 'error');
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <div className={`${isDark ? 'bg-[#1a1f2c]' : 'bg-white'} rounded-xl shadow-lg p-8`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <RotateCcw className={`h-8 w-8 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Reset App Data
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Clear settings and cached data
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className={`
          p-4 rounded-lg mb-8 border-l-4
          ${isDark 
            ? 'bg-yellow-900/20 border-yellow-600 text-yellow-400' 
            : 'bg-yellow-100 border-yellow-400 text-yellow-700'
          }
        `}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={`h-5 w-5 mt-0.5 ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`} />
            <div>
              <p className={`font-semibold ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                Warning
              </p>
              <p className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                Resetting app data will clear your settings and preferences. Your expense data and account information will be preserved.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Reset Options */}
        <div className="mb-8">
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Quick Reset Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reset Preferences */}
            <div className={`
              p-6 rounded-lg border-2
              ${isDark 
                ? 'bg-[#0c111c] border-gray-700' 
                : 'bg-gray-50 border-gray-200'
              }
            `}>
              <div className="flex items-start gap-3 mb-4">
                <RotateCcw className="h-6 w-6 text-blue-500" />
                <div>
                  <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Reset Preferences
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Clear theme, default dashboard, and notification settings
                  </p>
                </div>
              </div>
              <button
                onClick={resetPreferences}
                className={`
                  w-full py-2 px-4 rounded-lg font-medium transition-colors
                  ${isDark 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }
                `}
              >
                Reset Now
              </button>
            </div>

            {/* Clear Cache */}
            <div className={`
              p-6 rounded-lg border-2
              ${isDark 
                ? 'bg-[#0c111c] border-gray-700' 
                : 'bg-gray-50 border-gray-200'
              }
            `}>
              <div className="flex items-start gap-3 mb-4">
                <Trash2 className="h-6 w-6 text-orange-500" />
                <div>
                  <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Clear Cache
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Remove temporary data and cached files
                  </p>
                </div>
              </div>
              <button
                onClick={clearLocalCache}
                className={`
                  w-full py-2 px-4 rounded-lg font-medium transition-colors
                  ${isDark 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }
                `}
              >
                Reset Now
              </button>
            </div>
          </div>
        </div>

        {/* Full Reset Section */}
        <div className={`
          p-6 rounded-lg border-2
          ${isDark 
            ? 'bg-red-500/10 border-red-500/50' 
            : 'bg-red-50 border-red-200'
          }
        `}>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
            Full App Reset
          </h2>
          <p className={`mb-4 ${isDark ? 'text-red-300' : 'text-red-600'}`}>
            This will clear all preferences, settings, cache, and local data. Your account and expense data stored on the server will not be affected.
          </p>
          <button
            onClick={openFullResetModal}
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <RotateCcw className="h-5 w-5" />
            Full Reset
          </button>
        </div>
      </div>

      {/* Full Reset Modal */}
      {showFullResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`
            relative w-full max-w-md rounded-xl shadow-2xl
            ${isDark ? 'bg-[#1a1f2c]' : 'bg-white'}
          `}>
            {/* Modal Header */}
            <div className={`
              flex items-center justify-between p-6 border-b
              ${isDark ? 'border-gray-700' : 'border-gray-200'}
            `}>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Reset All Data
              </h2>
              <button
                onClick={closeFullResetModal}
                className={`
                  p-2 rounded-lg transition-colors
                  ${isDark 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Warning Box */}
              <div className={`
                p-4 rounded-lg border-l-4
                ${isDark 
                  ? 'bg-red-900/20 border-red-500 text-red-400' 
                  : 'bg-red-50 border-red-500 text-red-800'
                }
              `}>
                <p className="font-semibold flex items-center gap-2 mb-3">
                  <span className="text-xl">⚠️</span>
                  This action is irreversible!
                </p>
                <p className={`text-sm mb-3 ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                  The following will be cleared:
                </p>
                <ul className={`text-sm space-y-1 ml-6 list-disc ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                  <li>All uploaded receipts and expenses (LOCAL ONLY)</li>
                  <li>All notification history</li>
                  <li>Custom settings and preferences</li>
                  <li>Summary data stored locally</li>
                </ul>
                <p className={`text-sm mt-3 font-semibold ${isDark ? 'text-red-400' : 'text-red-800'}`}>
                  Your server-stored account and expense data will NOT be deleted.
                </p>
              </div>

              {/* Password Input */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`
                    w-full px-4 py-3 rounded-lg outline-none border-2
                    ${isDark 
                      ? 'bg-[#0c111c] text-white border-gray-700 focus:border-red-500' 
                      : 'bg-white text-gray-800 border-gray-300 focus:border-red-500'
                    }
                  `}
                  disabled={isResetting}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeFullResetModal}
                  disabled={isResetting}
                  className={`
                    flex-1 px-6 py-3 rounded-lg font-semibold transition-colors
                    ${isDark 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  Cancel
                </button>
                <button
                  onClick={performFullReset}
                  disabled={isResetting || !password}
                  className={`
                    flex-1 px-6 py-3 rounded-lg font-semibold transition-colors
                    bg-red-600 hover:bg-red-700 text-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {isResetting ? 'Resetting...' : 'Confirm Reset'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
