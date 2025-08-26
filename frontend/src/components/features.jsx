import React from "react";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      title: "Smart Receipt OCR",
      desc: "Extract data from receipts in seconds using AI-powered OCR technology.",
    },
    {
      title: "Expense Categorization",
      desc: "Automatic sorting of expenses into categories for better tracking.",
    },
    {
      title: "Multi-Language Support",
      desc: "Seamlessly handle Sinhala, Tamil, and English for all receipts.",
    },
  ];

  return (
    <section id="features" className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
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
            <h3 className="text-xl font-semibold text-emerald-400">{f.title}</h3>
            <p className="mt-2 text-slate-300">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
