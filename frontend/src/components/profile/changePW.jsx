import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

export default function ChangePassword() {
  const { isDark } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    verificationCode: ''
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const handleSendVerificationCode = async () => {
    try {
      setSendingCode(true);
      const email = JSON.parse(localStorage.getItem('user') || '{}').email;
      const token = localStorage.getItem('token');

      if (!email) {
        toast.show('Email not found. Please sign in again.', 'error');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/auth/send-code',
        { email },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.show('Verification code sent to your email!', 'success');
        setCodeSent(true);
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.show(error.response?.data?.message || 'Failed to send verification code', 'error');
    } finally {
      setSendingCode(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.oldPassword) {
      toast.show('Please enter your old password', 'error');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.show('New password must be at least 6 characters', 'error');
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.show('New passwords do not match.', 'error');
      return;
    }

    if (!formData.verificationCode) {
      toast.show('Please enter the verification code', 'error');
      return;
    }

    try {
      setIsChanging(true);
      const token = localStorage.getItem('token');
      const email = JSON.parse(localStorage.getItem('user') || '{}').email;

      const response = await axios.put(
        'http://localhost:5000/api/auth/change-password',
        {
          email,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmNewPassword,
          verificationCode: formData.verificationCode
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.show('Password changed successfully!', 'success');
        setTimeout(() => {
          navigate('/profile', { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMsg = error.response?.data?.message || 'Something went wrong, try again.';
      toast.show(errorMsg, 'error');
    } finally {
      setIsChanging(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center backdrop-blur-xl bg-black/30 py-8 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/profile', { replace: true })}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-800 text-emerald-400' 
                : 'hover:bg-gray-200 text-emerald-600'
            }`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Change Password
          </h1>
        </div>

        {/* Form Card */}
        <form onSubmit={handleChangePassword}>
          <div className={`backdrop-blur-lg rounded-2xl p-6 shadow-xl ${
            isDark 
              ? 'bg-gray-800/50 border border-emerald-400/20' 
              : 'bg-white/80 border border-gray-200'
          }`}>
            
            {/* Old Password Section */}
            <div className="mb-6">
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Old Password
              </h2>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type={showPassword.old ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  value={formData.oldPassword}
                  onChange={(e) => handleInputChange('oldPassword', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 outline-none transition-all ${
                    isDark 
                      ? 'bg-[#0c111c] text-white border-gray-700 focus:border-emerald-400' 
                      : 'bg-white text-gray-800 border-gray-300 focus:border-emerald-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showPassword.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password Section */}
            <div className="mb-6">
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                New Password
              </h2>
              <div className="space-y-3">
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    placeholder="Enter a new password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 outline-none transition-all ${
                      isDark 
                        ? 'bg-[#0c111c] text-white border-gray-700 focus:border-emerald-400' 
                        : 'bg-white text-gray-800 border-gray-300 focus:border-emerald-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={formData.confirmNewPassword}
                    onChange={(e) => handleInputChange('confirmNewPassword', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 outline-none transition-all ${
                      isDark 
                        ? 'bg-[#0c111c] text-white border-gray-700 focus:border-emerald-400' 
                        : 'bg-white text-gray-800 border-gray-300 focus:border-emerald-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <p className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Verification Section */}
            <div className="mb-6">
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Verification
              </h2>
              
              {/* Send Code Button */}
              <button
                type="button"
                onClick={handleSendVerificationCode}
                disabled={sendingCode || codeSent}
                className={`w-full mb-3 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  codeSent
                    ? isDark
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50'
                }`}
              >
                <Mail className="w-5 h-5" />
                {sendingCode ? 'Sending...' : codeSent ? 'Code Sent!' : 'Send verification code to email'}
              </button>

              {codeSent && (
                <p className={`text-xs mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  ✓ A 6-digit verification code has been sent to your email
                </p>
              )}

              {/* Verification Code Input */}
              <div className="relative">
                <Shield className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Enter verification code"
                  value={formData.verificationCode}
                  onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                  maxLength={6}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 outline-none transition-all ${
                    isDark 
                      ? 'bg-[#0c111c] text-white border-gray-700 focus:border-emerald-400' 
                      : 'bg-white text-gray-800 border-gray-300 focus:border-emerald-500'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Change Password Button */}
            <button
              type="submit"
              disabled={isChanging}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              {isChanging ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
