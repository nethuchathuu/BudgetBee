import React from "react";
import BeeLogo from "./BeeLogo";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <BeeLogo />
          <span>© {new Date().getFullYear()} BudgetBee</span>
        </div>
        <div className="text-xs text-slate-400">
          Automated Expense Tracker using Smart Receipt Recognition
        </div>
      </div>
    </footer>
  );
}
