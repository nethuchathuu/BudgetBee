import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Camera, Database, BarChart, Bell, FileText } from "lucide-react";

const steps = [
  { icon: <CheckCircle size={30} className="text-emerald-400" />, title: "Register & Login", description: "Securely sign up and access your personalized dashboard." },
  { icon: <Camera size={30} className="text-emerald-400" />, title: "Upload Receipt", description: "Simply snap or upload your receipt for instant processing." },
  { icon: <Database size={30} className="text-emerald-400" />, title: "Data Extraction & Categorization", description: "AI extracts key details and organizes expenses automatically." },
  { icon: <BarChart size={30} className="text-emerald-400" />, title: "View Summaries", description: "Track daily expenses and access past summaries effortlessly." },
  { icon: <Bell size={30} className="text-emerald-400" />, title: "Get Smart Alerts", description: "Receive overspending notifications and budget insights." },
  { icon: <FileText size={30} className="text-emerald-400" />, title: "Download Reports", description: "Export detailed expense reports for your records anytime." },
];

export default function HowItWorks() {
  return (
    <div 
    id = "HowItWorks"
    className="relative bg-gradient-to-b from-[#0c111c] via-[#0a0f1a] to-[#0b1422] text-white py-16 px-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-bold text-center mb-16"
      >
        How It Works
      </motion.h2>

      <div className="relative max-w-4xl mx-auto">
        {/* Vertical timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-emerald-400"></div>

        {steps.map((step, index) => {
          // Custom logic: 2nd, 4th, 6th steps (indices 1, 3, 5) go to the right
          const isRight = [1, 3, 5].includes(index);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: isRight ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="w-full flex justify-between mb-12 relative"
            >
              {/* Left Side Step */}
              {!isRight && (
                <div className="w-1/2 pr-8 text-right relative">
                  <div className="inline-block bg-[#1a1f2c] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center justify-end mb-2">
                      <h3 className="text-xl font-semibold mr-3">{step.title}</h3>
                      {step.icon}
                    </div>
                    <p className="text-slate-300">{step.description}</p>
                  </div>
                  <div className="absolute top-1/2 right-[-12px] w-6 h-6 bg-emerald-400 rounded-full border-4 border-[#0c111c] transform -translate-y-1/2"></div>
                </div>
              )}

              {/* Right Side Step */}
              {isRight && (
                <div className="w-1/2 pl-8 text-left relative">
                  <div className="inline-block bg-[#1a1f2c] p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center justify-start mb-2">
                      {step.icon}
                      <h3 className="text-xl font-semibold ml-3">{step.title}</h3>
                    </div>
                    <p className="text-slate-300">{step.description}</p>
                  </div>
                  <div className="absolute top-1/2 left-[-12px] w-6 h-6 bg-emerald-400 rounded-full border-4 border-[#0c111c] transform -translate-y-1/2"></div>
                </div>
              )}

              {/* Timeline Marker */}
              <div className="absolute left-1/2 transform -translate-x-1/2 bg-emerald-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {index + 1}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}