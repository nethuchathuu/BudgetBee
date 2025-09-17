import React from "react";
import background from "../../assets/login_backG.jpg"

export default function SignInLeft() {
  return (
    <div className="hidden md:flex w-1/2 relative">
      {/* Background Image */}
      <img
        src={background}
        alt="Financial Growth"
        className="absolute inset-0 w-full h-full object-cover rounded-l-2xl"
      />
      {/* Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 rounded-l-2xl flex items-center justify-center px-6">
        <p className="text-white text-2xl font-semibold text-center max-w-sm">
          “Smart spending today, brighter future tomorrow.”
        </p>
      </div>
    </div>
  );
}
