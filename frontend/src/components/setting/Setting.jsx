import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Palette, Home, Bell, HelpCircle, RotateCcw, ChevronRight, Menu, X, Languages } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import NavProfile from '../NavProfile';

const settingsMenu = [
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Palette,
    description: 'Toggle dark and light mode',
    path: '/settings/appearance'
  },
  {
    id: 'language',
    label: 'Language',
    icon: Languages,
    description: 'Change application language',
    path: '/settings/language'
  },
  {
    id: 'default-dashboard',
    label: 'Set Default Dashboard',
    icon: Home,
    description: 'Choose your preferred view',
    path: '/settings/setHome'
  },
  {
    id: 'notification-limits',
    label: 'Notification Limits',
    icon: Bell,
    description: 'Set budget alert limits',
    path: '/settings/notLimit'
  },
  {
    id: 'help-support',
    label: 'Help & Support',
    icon: HelpCircle,
    description: 'Instructions and contact info',
    path: '/settings/help'
  },
  {
    id: 'reset-data',
    label: 'Reset App Data',
    icon: RotateCcw,
    description: 'Clear all application data',
    path: '/settings/reset'
  }
];

export default function Setting() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isMainSettingsPage = location.pathname === '/settings';
  const showSidebar = !isMainSettingsPage;

  const handleLabelClick = (path) => {
    navigate(path);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'}`}>
      <NavProfile />
      
      <div className="pt-16 h-[calc(100vh-64px)] flex">
        {/* Mobile Menu Toggle Button */}
        {showSidebar && (
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className={`
              fixed top-20 left-4 z-50 p-2 rounded-lg lg:hidden
              ${isDark ? 'bg-[#1a1f2c] text-white' : 'bg-white text-gray-800'}
              shadow-lg
            `}
          >
            {isMobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        )}

        {/* Left Sidebar - Settings Menu (Hidden on main page) */}
        {showSidebar && (
          <>
            {/* Overlay for mobile */}
            {isMobileSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <aside
              className={`
                ${isDark ? 'bg-[#1a1f2c]' : 'bg-white'} 
                w-64 h-full overflow-y-auto shadow-xl
                fixed lg:sticky top-16 left-0 z-40
                transition-transform duration-300 ease-in-out
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              `}
            >
              <div className="p-6">
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Settings
                </h2>

                <div className="space-y-2">
                  {settingsMenu.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleLabelClick(item.path)}
                        className={`
                          flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all
                          ${isActive 
                            ? isDark 
                              ? 'bg-emerald-500/10 border-l-4 border-emerald-400' 
                              : 'bg-emerald-50 border-l-4 border-emerald-500'
                            : isDark
                              ? 'hover:bg-[#252b3b]'
                              : 'hover:bg-gray-100'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Icon 
                            className={`h-5 w-5 ${
                              isActive 
                                ? 'text-emerald-400' 
                                : isDark 
                                  ? 'text-gray-400' 
                                  : 'text-gray-600'
                            }`} 
                          />
                          <div>
                            <p className={`font-medium ${
                              isActive 
                                ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                                : isDark ? 'text-white' : 'text-gray-800'
                            }`}>
                              {item.label}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Right Content Area */}
        <main 
          className={`
            flex-1 overflow-y-auto
            ${showSidebar ? 'lg:ml-0' : 'w-full'}
            transition-all duration-300 ease-in-out
          `}
        >
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {isMainSettingsPage ? (
              <div className={`${isDark ? 'bg-[#1a1f2c]' : 'bg-white'} rounded-xl shadow-lg p-8`}>
                <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Application Settings
                </h1>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                  Customize your BudgetBee experience by selecting an option below.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {settingsMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`
                          p-6 rounded-lg cursor-pointer transition-all border-2
                          ${isDark 
                            ? 'bg-[#0c111c] border-emerald-400/20 hover:border-emerald-400/50 hover:shadow-xl' 
                            : 'bg-gray-50 border-gray-200 hover:border-emerald-400 hover:shadow-xl'
                          }
                        `}
                      >
                        <Icon className={`h-8 w-8 mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {item.label}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
