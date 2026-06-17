import React from "react";
import budgetImg from "../../assets/budget684.png";

export default function PhoneMock() {
  return (
    <div className="relative w-[280px] h-[580px] rounded-[40px] bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl border border-white/20 p-2 text-slate-400">
      <div className="bg-slate-900 rounded-3xl h-full w-full overflow-hidden flex items-center justify-center">
        <img 
          src={budgetImg} 
          alt="App UI Preview" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
