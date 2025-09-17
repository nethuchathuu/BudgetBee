import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import google from "../../assets/google_log.png";


export default function SignUpForm() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
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

      alert(response.data.message || "Signup successful!");
      navigate("/signin");
    } catch (error) {
      console.error("Error during signup:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.error || "Signup failed!");
      } else {
        alert("Something went wrong. Please try again.");
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
      
      <button className="w-full bg-white text-gray-900 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-gray-100 transition">
              <img src={google} alt="Google" className="w-5 h-5" />
              Sign Up with Google
      </button>
    </form>
  );
}
