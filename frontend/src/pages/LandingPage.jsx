import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Glow from "../components/com_landing/Glow";
import budgetImg from "../assets/budget_img.png";
import Features from "../components/com_landing/features";
import HowItWorks from "../components/com_landing/HowItWorks";

const colors = {
  bg: "from-[#0c111c] via-[#0a0f1a] to-[#0b1422]",
  textMuted: "text-slate-300",
};

export default function LandingPage() {
  return (
    <div className={`min-h-screen bg-gradient-to-b ${colors.bg} relative text-white overflow-hidden`}>
      <Glow className="-top-24 left-10 w-[420px] h-[420px]" />
      <Glow className="top-40 -right-24 w-[520px] h-[520px]" />
      <Navbar />

      <main className="relative z-10 pt-24">
        <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-8 md:grid-cols-2 md:py-16">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl leading-tight md:text-6xl font-extrabold tracking-tight"
            >
              Automated Expense Tracker
              <span className="block text-emerald-400">using Smart Receipt Recognition</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className={`mt-6 max-w-xl text-base md:text-lg ${colors.textMuted}`}
            >
              “Every receipt tells a story—BudgetBee turns it into your path to smarter spending and a brighter financial future.”
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a href="/signup" className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 py-3 font-semibold text-black shadow-xl hover:opacity-90">
                Get Started
              </a>
              
            </motion.div>
          </div>

          <div className="flex justify-center md:justify-end">
            <motion.img 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              src={budgetImg} 
              alt="App UI Preview" 
              className="w-full max-w-[400px] md:max-w-sm rounded-3xl shadow-2xl border border-white/10"
            />
          </div>
        </section>

        <Features />

        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}
