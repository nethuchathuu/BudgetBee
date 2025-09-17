import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import google from "../../assets/google_log.png";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signin", {
        email,
        password,
      });

      // Save token if provided
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      alert(response.data.message || "Login successful!");
      navigate("/dashboard"); // change this to where you want to redirect
    } catch (error) {
      console.error("Error during signin:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.error || "Signin failed!");
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Welcome Back
      </h2>

      {/* Email & Password Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-black font-bold py-3 rounded-lg hover:bg-green-400 transition"
        >
          Sign In
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center justify-between mb-4">
        <span className="border-t border-gray-600 w-1/4"></span>
        <span className="text-gray-400 text-sm">or sign in with</span>
        <span className="border-t border-gray-600 w-1/4"></span>
      </div>

      {/* Google Sign-In */}
      <button className="w-full bg-white text-gray-900 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-gray-100 transition">
        <img src={google} alt="Google" className="w-5 h-5" />
        Sign in with Google
      </button>

      <p className="text-gray-400 mt-6 text-center">
        Don’t have an account?{" "}
        <a href="/signup" className="text-green-500 hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
}
