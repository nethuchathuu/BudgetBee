import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Bell, User } from "lucide-react";
import logo from "../assets/logo.png";


export default function NavBar() {
  const navigate = useNavigate();
  const [openSummary, setOpenSummary] = useState(false);

  return (
    <nav className="flex items-center justify-between bg-[#0c111c] px-6 py-3 shadow-lg border-b border-emerald-400/20">
      {/* Left: Logo & Name */}
      <div className="flex items-center space-x-2">
        <img src={logo} alt="BudgetBee" className="h-8 w-8" />
        <span className="text-xl font-bold text-emerald-400">BudgetBee</span>
      </div>

      {/* Middle: Buttons */}
      <div className="flex items-center space-x-6">
        {/* New */}
        <button
          onClick={() => navigate("/upload")}
          className="bg-[#1a1f2c] hover:bg-emerald-400 hover:text-[#0c111c] text-white px-4 py-2 rounded-xl shadow transition"
        >
          New
        </button>

        {/* Summary */}
        <div className="relative">
          <button
            onClick={() => setOpenSummary(!openSummary)}
            className="flex items-center bg-[#1a1f2c] hover:bg-emerald-400 hover:text-[#0c111c] text-white px-4 py-2 rounded-xl shadow transition"
          >
            Summary <ChevronDown className="ml-1 h-4 w-4" />
          </button>
          {openSummary && (
            <div className="absolute mt-2 w-44 bg-[#1a1f2c] text-white rounded-xl shadow-xl p-2 z-10 border border-emerald-400/20">
              <button
                onClick={() => navigate("/summary/day")}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-emerald-400 hover:text-[#0c111c] transition"
              >
                Last Day
              </button>
              <button
                onClick={() => navigate("/summary/week")}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-emerald-400 hover:text-[#0c111c] transition"
              >
                Last Week
              </button>
              <button
                onClick={() => navigate("/summary/month")}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-emerald-400 hover:text-[#0c111c] transition"
              >
                Last Month
              </button>
            </div>
          )}
        </div>

        {/* Diary */}
        <button
          onClick={() => navigate("/diary")}
          className="bg-[#1a1f2c] hover:bg-emerald-400 hover:text-[#0c111c] text-white px-4 py-2 rounded-xl shadow transition"
        >
          Diary
        </button>
      </div>

      {/* Right: Notification & Profile */}
      <div className="flex items-center space-x-4">
        <Bell className="h-6 w-6 text-emerald-400 cursor-pointer" />
        <User
          className="h-6 w-6 text-emerald-400 cursor-pointer"
          onClick={() => navigate("/profile")}
        />
      </div>
    </nav>
  );
}
