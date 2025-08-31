import React from "react";
import google from "../../assets/google_log.png";

export default function SignUpForm() {
  return (
    <form className="space-y-4">
      <input type="text" placeholder="Full Name" className="w-full p-3 rounded-xl bg-[#1e293b] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"/>
      <input type="email" placeholder="Email" className="w-full p-3 rounded-xl bg-[#1e293b] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"/>
      <input type="password" placeholder="Password" className="w-full p-3 rounded-xl bg-[#1e293b] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"/>
      <input type="password" placeholder="Confirm Password" className="w-full p-3 rounded-xl bg-[#1e293b] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"/>

      <button className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl font-semibold">
        Sign Up
      </button>

      {/* Google Login Button */}
      
      <button className="w-full bg-white text-gray-900 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-gray-100 transition">
              <img src={google} alt="Google" className="w-5 h-5" />
              Sign Up with Google
      </button>
    </form>
  );
}
