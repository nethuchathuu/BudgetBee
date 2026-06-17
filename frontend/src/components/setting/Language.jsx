import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Languages, Check } from 'lucide-react';

export default function Language() {
  const { isDark } = useTheme();
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    // Detect current language from Google Translate cookie
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    
    const googtrans = getCookie('googtrans');
    if (googtrans) {
      if (googtrans.includes('/si')) setCurrentLang('si');
      else if (googtrans.includes('/ta')) setCurrentLang('ta');
      else setCurrentLang('en');
    }
  }, []);

  const changeLanguage = (langCode) => {
    // Set the cookie for google translate
    // Format is /pageLanguage/targetLanguage, e.g. /en/si
    const cookieString = `/en/${langCode}`;
    
    // Set cookie for current path and root
    document.cookie = `googtrans=${cookieString}; path=/`;
    if (window.location.hostname !== 'localhost') {
      document.cookie = `googtrans=${cookieString}; domain=${window.location.hostname}; path=/`;
    }
    
    setCurrentLang(langCode);
    
    // Reload the page to apply translations app-wide
    window.location.reload();
  };

  const languages = [
    { code: 'en', name: 'English (Default)' },
    { code: 'si', name: 'Sinhala (සිංහල)' },
    { code: 'ta', name: 'Tamil (தமிழ்)' }
  ];

  return (
    <div className={`p-6 rounded-xl shadow-sm ${isDark ? 'bg-[#1a1f2c]' : 'bg-white'}`}>
      <div className="flex items-center gap-3 mb-6">
        <Languages className={`h-6 w-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Language Settings
        </h2>
      </div>

      <div className="space-y-6">
        <div className={`p-6 rounded-xl border ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-emerald-100 bg-emerald-50/50'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Select Application Language
          </h3>
          <p className={`text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose your preferred language below. It will instantly translate the entire application.
          </p>
          
          <div className="grid gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`
                  flex items-center justify-between p-4 rounded-lg border-2 transition-all w-full text-left
                  ${currentLang === lang.code 
                    ? isDark 
                      ? 'border-emerald-400 bg-emerald-400/10' 
                      : 'border-emerald-500 bg-emerald-50'
                    : isDark
                      ? 'border-gray-700 bg-[#0c111c] hover:border-gray-600'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <span className={`font-medium ${
                  currentLang === lang.code
                    ? isDark ? 'text-emerald-400' : 'text-emerald-700'
                    : isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  {lang.name}
                </span>
                {currentLang === lang.code && (
                  <Check className={`h-5 w-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className={`p-4 rounded-lg flex gap-3 ${isDark ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-50 text-blue-800'}`}>
          <div className="flex-1">
            <p className="text-sm">
              <strong>Note:</strong> We use Google Translate to provide application-wide translations. Selecting a language here will reload the page to apply the translation immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
