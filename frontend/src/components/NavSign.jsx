import React from "react";
import { Link } from "react-router-dom";
import BeeLogo from "./BeeLogo";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c111c]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>  
            <BeeLogo />
          </Link>
          <span className="text-xl font-semibold tracking-tight text-white">BudgetBee</span>
        </div>

        
      </nav>
    </header>
  );
}
