import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, Trash2, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

export default function Reset() {
  const { isDark } = useTheme();
  const toast = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const resetOptions = [
    {
      id: 'preferences',
      name: 'Reset Preferences',
      description: 'Clear theme, default dashboard, and notification settings',
      icon: RotateCcw,
      color: 'text-blue-500',
      action: () => {
        localStorage.removeItem('budgetbee-theme');
        localStorage.removeItem('budgetbee-default-dashboard');
        localStorage.removeItem('budgetbee-notification-limits');
        toast.show('Preferences reset successfully!', 'success');
      }
    },
    {
      id: 'cache',
      name: 'Clear Cache',
      description: 'Remove temporary data and cached files',
      icon: Trash2,
      color: 'text-orange-500',
      action: () => {
        // Clear any cached data
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }
        toast.show('Cache cleared successfully!', 'success');
      }
    }
  ];

  const handleFullReset = () => {
    if (confirmText.toLowerCase() === 'reset') {
      // Clear all localStorage data except authentication
      const token = localStorage.getItem('token');
      localStorage.clear();
      if (token) {
        localStorage.setItem('token', token);
      }
      
      // Clear cache
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }

      toast.show('All app data has been reset!', 'success');
      setShowConfirmation(false);
      setConfirmText('');
      
      // Reload page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      toast.show('Please type "RESET" to confirm', 'error');
    }
  };

  return (
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
          ? 'bg-orange-500/10 border-orange-400' 
          : 'bg-orange-50 border-orange-500'
        }
      `}>
        <div className="flex items-start gap-3">
          <AlertTriangle className={`h-5 w-5 mt-0.5 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
          <div>
            <p className={`font-semibold ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
              Warning
            </p>
            <p className={`text-sm ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
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
          {resetOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                className={`
                  p-6 rounded-lg border-2
                  ${isDark 
                    ? 'bg-[#0c111c] border-gray-700' 
                    : 'bg-gray-50 border-gray-200'
                  }
                `}
              >
                <div className="flex items-start gap-3 mb-4">
                  <Icon className={`h-6 w-6 ${option.color}`} />
                  <div>
                    <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {option.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {option.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={option.action}
                  className={`
                    w-full py-2 px-4 rounded-lg font-medium transition-colors
                    ${isDark 
                      ? 'bg-[#1a1f2c] text-white hover:bg-emerald-500' 
                      : 'bg-gray-200 text-gray-800 hover:bg-emerald-500 hover:text-white'
                    }
                  `}
                >
                  Reset Now
                </button>
              </div>
            );
          })}
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

        {!showConfirmation ? (
          <button
            onClick={() => setShowConfirmation(true)}
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <RotateCcw className="h-5 w-5" />
            Reset All Data
          </button>
        ) : (
          <div className="space-y-4">
            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Type <span className="font-bold text-red-500">RESET</span> to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type RESET"
              className={`
                w-full px-4 py-3 rounded-lg outline-none border-2
                ${isDark 
                  ? 'bg-[#0c111c] text-white border-gray-700 focus:border-red-500' 
                  : 'bg-white text-gray-800 border-gray-300 focus:border-red-500'
                }
              `}
            />
            <div className="flex gap-3">
              <button
                onClick={handleFullReset}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setConfirmText('');
                }}
                className={`
                  px-6 py-3 rounded-lg font-semibold transition-colors
                  ${isDark 
                    ? 'bg-[#0c111c] text-white hover:bg-[#1a1f2c]' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }
                `}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
