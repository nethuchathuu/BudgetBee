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
          <span className="text-xl font-semibold tracking-tight">BudgetBee</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#HowItWorks" className="hover:text-white transition">How it Works</a>
        </div>

        <div className="flex items-center gap-3">
          <a href="/signin" className="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 transition">
            Sign in
          </a>
          <a href="/signup" className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-4 py-2 text-sm font-medium text-black hover:opacity-90 transition shadow-lg">
            Sign up
          </a>
        </div>
      </nav>
    </header>
  );
}
