import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const SumNav = ({ pageTitle }) => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-lg mb-6">
      {/* Back Button */}
      <button
        onClick={handleBackToHome}
        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Home</span>
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        {pageTitle}
      </h1>

      {/* Empty div for spacing balance */}
      <div className="w-32"></div>
    </div>
  );
};

export default SumNav;