import React from "react";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      title: "Automatic Item Details Capture",
      desc: "Quickly grab item names, prices, and dates from receipts, saving time and reducing manual input while organizing expenses automatically.",
    },
    {
      title: "Fixable Receipt Info",
      desc: "Easily review and correct captured details like categories or costs to maintain accurate financial records.",
    },
    {
      title: "Daily Budget Tips",
      desc: "Get personalized spending insights to stay within your daily budget and make smarter financial decisions.",
    },
    {
      title: "Daily Spending Charts",
      desc: "Visualize expenses with clear bar or pie charts to understand where your money goes each day.",
    },
    {
      title: "Downloadable Daily Reports",
      desc: "Export daily expense reports as PDFs for easy sharing and record-keeping.",
    },
    {
      title: "Look Back at Past Days",
      desc: "Track and review past spending patterns with graphical insights for better financial planning.",
    },
    {
      title: "Simple and Accessible Design",
      desc: "Enjoy a clean and intuitive interface designed for smooth navigation and ease of use.",
    },
    {
      title: "Notification System",
      desc: "Receive timely alerts for overspending with category-wise breakdowns to stay in control of your budget.",
    },
  ];

  return (
    <section
      id="features"
      className="relative z-10 py-16 px-6 max-w-7xl mx-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-bold text-center text-white"
      >
        Key Features
      </motion.h2>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition"
          >
            <h3 className="text-xl font-semibold text-emerald-400">
              {f.title}
            </h3>
            <p className="mt-2 text-slate-300">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
