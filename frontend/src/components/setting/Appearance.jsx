import React from 'react';
import { Sun, Moon, Palette, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Appearance() {
  const { theme, setTheme, isDark } = useTheme();

  const themeOptions = [
    {
      id: 'light',
      name: 'Light Mode',
      icon: Sun,
      description: 'Clean and bright interface',
      preview: {
        bg: 'from-white via-gray-50 to-gray-100',
        card: 'bg-white',
        text: 'text-gray-800',
        accent: 'text-emerald-500'
      }
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      icon: Moon,
      description: 'Easy on the eyes in low light',
      preview: {
        bg: 'from-[#0c111c] via-[#0a0f1a] to-[#0b1422]',
        card: 'bg-[#1a1f2c]',
        text: 'text-white',
        accent: 'text-emerald-400'
      }
    }
  ];

  return (
    <div className={`${isDark ? 'bg-[#1a1f2c]' : 'bg-white'} rounded-xl shadow-lg p-8`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Palette className={`h-8 w-8 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Appearance
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Customize how BudgetBee looks for you
          </p>
        </div>
      </div>

      {/* Theme Toggle Section */}
      <div className="mb-8">
        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Choose Your Theme
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = theme === option.id;

            return (
              <div
                key={option.id}
                onClick={() => setTheme(option.id)}
                className={`
                  relative cursor-pointer rounded-xl overflow-hidden transition-all
                  ${isSelected 
                    ? 'ring-4 ring-emerald-400 shadow-xl' 
                    : isDark 
                      ? 'ring-2 ring-gray-700 hover:ring-gray-600' 
                      : 'ring-2 ring-gray-200 hover:ring-gray-300'
                  }
                `}
              >
                {/* Selection Badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-emerald-400 rounded-full p-2 z-10">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                )}

                {/* Preview */}
                <div className={`bg-gradient-to-br ${option.preview.bg} p-6 h-48`}>
                  <div className={`${option.preview.card} rounded-lg p-4 shadow-lg`}>
                    <div className={`flex items-center gap-2 mb-3`}>
                      <Icon className={`h-6 w-6 ${option.preview.accent}`} />
                      <span className={`font-semibold ${option.preview.text}`}>
                        {option.name}
                      </span>
                    </div>
                    <div className={`h-2 ${option.preview.accent} bg-opacity-20 rounded-full mb-2`}></div>
                    <div className={`h-2 ${option.preview.accent} bg-opacity-10 rounded-full w-3/4`}></div>
                  </div>
                </div>

                {/* Details */}
                <div className={`p-4 ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'}`}>
                  <h3 className={`font-semibold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {option.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {option.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Theme Info */}
      <div className={`
        p-6 rounded-lg border-2
        ${isDark 
          ? 'bg-[#0c111c] border-emerald-400/30' 
          : 'bg-emerald-50 border-emerald-200'
        }
      `}>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-400 rounded-full p-2">
            {theme === 'dark' ? (
              <Moon className="h-5 w-5 text-white" />
            ) : (
              <Sun className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Currently Active: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Your preference is saved and will persist across sessions
            </p>
          </div>
        </div>
      </div>

      {/* Color Preview Cards */}
      <div className="mt-8">
        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Color Preview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-[#0c111c]' : 'bg-gray-100'}`}>
            <div className={`w-full h-12 rounded ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'} mb-2`}></div>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Accent</p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-[#0c111c]' : 'bg-gray-100'}`}>
            <div className={`w-full h-12 rounded ${isDark ? 'bg-[#1a1f2c]' : 'bg-white'} mb-2 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}></div>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Card</p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-[#0c111c]' : 'bg-gray-100'}`}>
            <div className={`w-full h-12 rounded ${isDark ? 'bg-white' : 'bg-gray-800'} mb-2`}></div>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Text</p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-[#0c111c]' : 'bg-gray-100'}`}>
            <div className={`w-full h-12 rounded ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'} mb-2 border ${isDark ? 'border-emerald-400/20' : 'border-gray-300'}`}></div>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Background</p>
          </div>
        </div>
      </div>
    </div>
  );
}
