import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from '../../context/ToastContext';
import GoogleAuth from "../GoogleAuth";


export default function SignUpForm() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.show("Passwords do not match!", 'error');
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      );

      toast.show(response.data.message || "Signup successful!", 'success');
      navigate("/signin");
    } catch (error) {
      console.error("Error during signup:", error);
      if (error.response && error.response.data) {
        toast.show(error.response.data.error || "Signup failed!", 'error');
      } else {
        toast.show("Something went wrong. Please try again.", 'error');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="text" 
        name="fullname" 
        placeholder="Full Name" 
        value={formData.fullname}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-[#1e293b] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-[#1e293b] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-[#1e293b] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-[#1e293b] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <button 
        type="submit" 
        className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl font-semibold"
      >
        Sign Up
      </button>

      {/* Google Login Button */}
      
      <GoogleAuth text="Sign Up with Google" />
    </form>
  );
}
