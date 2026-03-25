import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell, User, Settings } from "lucide-react";
import logo from "../assets/logo.png";
import axios from "axios";

export default function NavProfile() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const userId = localStorage.getItem('user_id') || 1;
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:5000/api/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const unread = response.data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      // Fallback to localStorage
      const localNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const unread = localNotifications.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[#0c111c] px-6 py-3 shadow-lg border-b border-emerald-400/20">
      {/* Left: Logo & Name */}
      <div
        className="flex items-center space-x-2 cursor-pointer notranslate"
        onClick={() => navigate("/home")}  
        translate="no"
      >
        <img src={logo} alt="BudgetBee" className="h-8 w-8" />
        <span className="text-xl font-bold text-emerald-400">BudgetBee</span>
      </div>

      {/* Right: Notification, Settings & Profile */}
      <div className="flex items-center space-x-4">
        <Link to="/notification" className="relative">
          <Bell className="h-6 w-6 text-emerald-400 cursor-pointer hover:text-emerald-300 transition" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-semibold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>
        <Settings 
          className="h-6 w-6 text-emerald-400 cursor-pointer hover:text-emerald-300 transition" 
          onClick={() => navigate("/settings")}
        />
        <User
          className="h-6 w-6 text-emerald-400 cursor-pointer hover:text-emerald-300 transition"
          onClick={() => navigate("/profile")}
        />
      </div>
    </nav>
  );
}
