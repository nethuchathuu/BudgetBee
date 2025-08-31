import React from "react";
import SignUpForm from "./SignUpForm";

export default function SignUpRight() {
  return (
    <div className="w-full md:w-1/2 p-8 md:p-12 text-white">
      <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
      <SignUpForm />
      <p className="text-center mt-6 text-gray-400">
        Already have an account? <a href="/signin" className="text-green-500 hover:underline">Sign In</a>
      </p>
    </div>
  );
}
