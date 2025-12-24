import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

export default function ForgotPassword() {
  const { isDark } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });

  const [isResetting, setIsResetting] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user email from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
      setUserEmail(user.email);
      // Automatically send verification code on component mount
      sendVerificationCode(user.email);
    } else {
      toast.show('No email found. Please sign in first.', 'error');
      navigate('/signin');
    }
  }, []);

  const sendVerificationCode = async (email) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/send-reset-code', {
        email
      });

      if (response.data.success) {
        toast.show('Verification code sent to your registered email', 'success');
      }
    } catch (error) {
      console.error('Error sending reset code:', error);
      toast.show(error.response?.data?.message || 'Failed to send verification code', 'error');
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.verificationCode) {
      toast.show('Please enter the verification code', 'error');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.show('Password must be at least 8 characters', 'error');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.show('Passwords do not match', 'error');
      return;
    }

    try {
      setIsResetting(true);
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email: userEmail,
        verificationCode: formData.verificationCode,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        toast.show('Password successfully reset! Please login again.', 'success');
        setTimeout(() => {
          navigate('/signin', { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      const errorMsg = error.response?.data?.message || 'Failed to reset password. Please try again.';
      toast.show(errorMsg, 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center py-8 px-4 ${
      isDark ? 'bg-[#0c111c]' : 'bg-gray-100'
    }`}>
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/signin', { replace: true })}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-800 text-emerald-400' 
                : 'hover:bg-gray-200 text-emerald-600'
            }`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Reset Password
          </h1>
        </div>

        {/* Main Card */}
        <form onSubmit={handleResetPassword}>
          <div className={`backdrop-blur-lg rounded-2xl p-8 shadow-xl ${
            isDark 
              ? 'bg-gray-800/50 border border-emerald-400/20' 
              : 'bg-white/80 border border-gray-200'
          }`}>
            
            {/* Info Message */}
            <div className={`mb-6 p-4 rounded-lg ${
              isDark ? 'bg-emerald-900/20 border border-emerald-400/30' : 'bg-emerald-50 border border-emerald-200'
            }`}>
              <p className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                Verification code sent to your registered email
              </p>
              {userEmail && (
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {userEmail}
                </p>
              )}
            </div>

            {/* Verification Code */}
            <div className="mb-6">
              <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Verification Code
              </h2>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter the 6-digit code from your email
              </p>

              <div className="relative">
                <Shield className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  value={formData.verificationCode}
                  onChange={(e) => handleInputChange('verificationCode', e.target.value.replace(/\D/g, ''))}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 outline-none transition-colors text-center text-2xl font-mono tracking-widest ${
                    isDark 
                      ? 'bg-[#0c111c] text-white border-gray-700 focus:border-emerald-400' 
                      : 'bg-white text-gray-900 border-gray-300 focus:border-emerald-600'
                  }`}
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => sendVerificationCode(userEmail)}
                className={`text-sm mt-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'} hover:underline`}
              >
                Resend Code
              </button>
            </div>

            {/* New Password */}
            <div className="mb-6">
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                New Password
              </h2>

              <div className="space-y-4">
                {/* New Password Input */}
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    placeholder="New password (8+ characters)"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 outline-none transition-colors ${
                      isDark 
                        ? 'bg-[#0c111c] text-white border-gray-700 focus:border-emerald-400' 
                        : 'bg-white text-gray-900 border-gray-300 focus:border-emerald-600'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword.new ? (
                      <EyeOff className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <Eye className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </button>
                </div>

                {/* Confirm Password Input */}
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 outline-none transition-colors ${
                      isDark 
                        ? 'bg-[#0c111c] text-white border-gray-700 focus:border-emerald-400' 
                        : 'bg-white text-gray-900 border-gray-300 focus:border-emerald-600'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword.confirm ? (
                      <EyeOff className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <Eye className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isResetting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResetting ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </div>
        </form>

        {/* Back to Sign In Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/signin')}
            className={`text-sm ${isDark ? 'text-gray-400 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'} hover:underline`}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
