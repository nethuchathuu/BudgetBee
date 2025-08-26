import React from "react";
import { motion } from "framer-motion";


// Brand colors inspired by the reference image
const colors = {
  bg: "from-[#0c111c] via-[#0a0f1a] to-[#0b1422]", // deep blue/black
  card: "bg-[#0f172a]/60", // slate with translucency
  accent: "#22c55e", // emerald
  accent2: "#16a34a", // deeper emerald
  textMuted: "text-slate-300",
};

const Glow = ({ className = "" }) => (
  <div
    className={`pointer-events-none absolute blur-3xl opacity-50 ${className}`}
    style={{
      background:
        "radial-gradient(50% 50% at 50% 50%, rgba(34,197,94,0.35) 0%, rgba(34,197,94,0.1) 40%, transparent 70%)",
    }}
  />
);

const PhoneMock = () => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="relative w-[300px] h-[620px] rounded-[40px] border border-white/10 bg-gradient-to-b from-[#0b1220] to-[#0b1a2a] shadow-[0_20px_80px_rgba(0,0,0,0.5)] overflow-hidden"
  >
    <div className="absolute inset-0">
      <Glow className="-top-10 -left-10 w-[280px] h-[280px]" />
      <Glow className="-bottom-10 -right-16 w-[320px] h-[320px] opacity-40" />
    </div>
    <div className="relative p-5">
      <div className="mx-auto mb-4 h-6 w-40 rounded-full bg-black/40" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-emerald-500/30 ring-1 ring-emerald-400/30" />
          <div>
            <p className="text-xs text-slate-300">Hi, Stefan!</p>
            <p className="text-[10px] text-slate-400">Welcome back to BudgetBee</p>
          </div>
        </div>
        <div className="text-[10px] text-slate-400">09:41</div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-[#0a1422]/60 p-4">
        <p className="text-slate-300 text-xs">Total Balance</p>
        <p className="mt-1 text-3xl font-semibold text-white">$22,350.50</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-500/15 p-3 ring-1 ring-emerald-400/20">
            <p className="text-[11px] text-emerald-300">Monthly Budget</p>
            <p className="text-lg text-white">$3,000</p>
          </div>
          <div className="rounded-xl bg-sky-500/10 p-3 ring-1 ring-sky-400/20">
            <p className="text-[11px] text-sky-300">Saved</p>
            <p className="text-lg text-white">$650</p>
          </div>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-white/10">
          <div className="h-2 rounded-full bg-emerald-500" style={{ width: "45%" }} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {["Groceries", "Transport", "Entertainment", "Bills"].map((t, i) => (
          <div key={t} className="flex items-center justify-between rounded-xl bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/10" />
              <div>
                <p className="text-sm text-white">{t}</p>
                <p className="text-[10px] text-slate-400">{new Date().toDateString()}</p>
              </div>
            </div>
            <p className={`text-sm ${i % 2 ? "text-emerald-400" : "text-rose-400"}`}>
              {i % 2 ? "+$12.40" : "-$26.10"}
            </p>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const BeeLogo = () => (
  <svg width="26" height="26" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 6c5 0 9 4 9 9v3h3a6 6 0 010 12h-3v3c0 5-4 9-9 9s-9-4-9-9v-3h-3a6 6 0 010-12h3v-3c0-5 4-9 9-9z" fill="#22c55e" opacity="0.85"/>
    <path d="M15 18h18M15 30h18" stroke="#0a0f1a" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export default function BudgetBeeLanding() {
  return (
    <div className={`min-h-screen bg-gradient-to-b ${colors.bg} relative text-white overflow-hidden`}>
      {/* Decorative glows */}
      <Glow className="-top-24 left-10 w-[420px] h-[420px]" />
      <Glow className="top-40 -right-24 w-[520px] h-[520px]" />

      {/* Navbar */}
      <header className="relative z-10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <BeeLogo />
            <span className="text-xl font-semibold tracking-tight">BudgetBee</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how" className="hover:text-white transition">How it Works</a>
            <a href="#security" className="hover:text-white transition">Security</a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/signin"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 transition"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-4 py-2 text-sm font-medium text-black hover:opacity-90 transition shadow-lg"
            >
              Sign up
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10">
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
              “Turn every receipt into wisdom.” BudgetBee captures receipts, extracts details with OCR, and turns spending into clear, actionable insights—so you can plan, save, and grow with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <a
                href="/signup"
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 py-3 font-semibold text-black shadow-xl hover:opacity-90"
              >
                Get Started
              </a>
              <a
                href="#how"
                className="rounded-2xl border border-white/15 px-6 py-3 text-slate-200 hover:bg-white/10"
              >
                See how it works
              </a>
            </motion.div>

            <div className="mt-10 flex items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Bank-grade encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Privacy-first by design</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <PhoneMock />
          </div>
        </section>

        {/* Feature strip */}
        <section id="features" className="mx-auto max-w-7xl px-6 pb-20">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                title: "Snap & Parse",
                body: "Upload or capture receipts. BudgetBee extracts merchant, date, items, and totals in seconds.",
              },
              {
                title: "Auto-Categorize",
                body: "Smart NLP tags every expense and maps it to your budgets with transparent rules.",
              },
              {
                title: "Visual Insights",
                body: "Daily summaries and trends that make saving simple and decisions clearer.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.05 * i }}
                className={`rounded-2xl ${colors.card} p-6 ring-1 ring-white/10 backdrop-blur`}
              >
                <div className="mb-3 h-10 w-10 rounded-xl bg-emerald-500/20 ring-1 ring-emerald-400/30" />
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className={`mt-2 text-sm ${colors.textMuted}`}>{f.body}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
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
    </div>
  );
}
