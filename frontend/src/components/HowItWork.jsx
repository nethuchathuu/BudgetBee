import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Camera, Database, BarChart, Bell, FileText } from "lucide-react";

const steps = [
  {
    icon: <CheckCircle size={40} className="text-emerald-400" />,
    title: "Register & Login",
    description: "Securely sign up and access your personalized dashboard.",
  },
  {
    icon: <Camera size={40} className="text-emerald-400" />,
    title: "Upload Receipt",
    description: "Simply snap or upload your receipt for instant processing.",
  },
  {
    icon: <Database size={40} className="text-emerald-400" />,
    title: "Data Extraction & Categorization",
    description: "AI extracts key details and organizes expenses automatically.",
  },
  {
    icon: <BarChart size={40} className="text-emerald-400" />,
    title: "View Summaries",
    description: "Track daily expenses and access past summaries effortlessly.",
  },
  {
    icon: <Bell size={40} className="text-emerald-400" />,
    title: "Get Smart Alerts",
    description: "Receive overspending notifications and budget insights.",
  },
  {
    icon: <FileText size={40} className="text-emerald-400" />,
    title: "Download Reports",
    description: "Export detailed expense reports for your records anytime.",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c111c] via-[#0a0f1a] to-[#0b1422] text-white py-16 px-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-bold text-center mb-10"
      >
        How It Works
      </motion.h2>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-[#1a1f2c] shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex justify-center mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-center">{step.title}</h3>
            <p className="text-slate-300 text-center">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
