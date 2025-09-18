import React from "react";
import NavBar from "../components/NavHome";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Navbar */}
      <NavBar />

      {/* Body Placeholder */}
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald-600 mb-4">
            🚧 Features Coming Soon...
          </h1>
          <p className="text-slate-700">
            Stay tuned! Your BudgetBee dashboard will be ready shortly.
          </p>
        </div>
      </main>
    </div>
  );
}
