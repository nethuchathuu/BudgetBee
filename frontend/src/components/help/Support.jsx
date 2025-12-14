import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, X, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

export default function Support() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fromEmail: '',
    subject: '',
    description: '',
    attachments: []
  });

  useEffect(() => {
    const fetchUserEmail = async () => {
      // 1. Try getting from 'user' object in localStorage
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.email) {
            setFormData(prev => ({ ...prev, fromEmail: user.email }));
            return;
          }
        }
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }

      // 2. Fallback: Try 'user_email' key (legacy)
      const legacyEmail = localStorage.getItem('user_email');
      if (legacyEmail) {
        setFormData(prev => ({ ...prev, fromEmail: legacyEmail }));
        return;
      }

      // 3. Fallback: Fetch from API using user_id
      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');
      
      if (userId && token) {
        try {
          const response = await axios.get(`http://localhost:5000/api/user/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success && response.data.data.email) {
            setFormData(prev => ({ ...prev, fromEmail: response.data.data.email }));
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserEmail();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file size (10MB limit)
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    
    if (validFiles.length !== files.length) {
      toast.show('Some files were skipped because they exceed 10MB', 'warning');
    }

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('fromEmail', formData.fromEmail);
      data.append('subject', formData.subject);
      data.append('description', formData.description);
      
      formData.attachments.forEach(file => {
        data.append('attachments', file);
      });

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/support/send', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      toast.show('Support request sent successfully!', 'success');
      navigate('/settings/help'); // Navigate back to help page
    } catch (error) {
      console.error('Error sending support request:', error);
      toast.show('Failed to send support request. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-[#0c111c]' : 'bg-gray-100'}`}>
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 mb-6 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Help
        </button>

        <div className={`
          rounded-xl shadow-xl overflow-hidden backdrop-blur-lg border
          ${isDark 
            ? 'bg-[#1a1f2c]/80 border-gray-700' 
            : 'bg-white/80 border-gray-200'
          }
        `}>
          {/* Header */}
          <div className={`p-8 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <Mail className={`h-8 w-8 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Contact Support
                </h1>
                <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  We're here to help. Fill out the form below and we'll get back to you shortly.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Email Field */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Your Email
              </label>
              <input
                type="email"
                name="fromEmail"
                value={formData.fromEmail}
                readOnly
                className={`
                  w-full px-4 py-3 rounded-lg border outline-none cursor-not-allowed opacity-70
                  ${isDark 
                    ? 'bg-[#0c111c] border-gray-700 text-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-500'
                  }
                `}
              />
            </div>

            {/* Subject Field */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Subject / Purpose
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g. Issue with bill upload / Account problem"
                required
                maxLength={120}
                className={`
                  w-full px-4 py-3 rounded-lg border outline-none transition-colors
                  ${isDark 
                    ? 'bg-[#0c111c] border-gray-700 text-white focus:border-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500'
                  }
                `}
              />
            </div>

            {/* Description Field */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your issue clearly..."
                required
                minLength={20}
                rows={6}
                className={`
                  w-full px-4 py-3 rounded-lg border outline-none transition-colors resize-none
                  ${isDark 
                    ? 'bg-[#0c111c] border-gray-700 text-white focus:border-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500'
                  }
                `}
              />
              <p className={`text-xs mt-2 text-right ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Minimum 20 characters
              </p>
            </div>

            {/* Attachments */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Attachments (Optional)
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border border-dashed transition-colors
                    ${isDark 
                      ? 'border-gray-600 hover:border-emerald-500 text-gray-300' 
                      : 'border-gray-300 hover:border-emerald-500 text-gray-600'
                    }
                  `}>
                    <Paperclip className="h-4 w-4" />
                    <span>Add Files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Max 10MB per file. Images and PDFs only.
                  </span>
                </div>

                {/* File List */}
                {formData.attachments.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {formData.attachments.map((file, index) => (
                      <div 
                        key={index}
                        className={`
                          flex items-center justify-between p-2 rounded-lg text-sm
                          ${isDark ? 'bg-[#0c111c]' : 'bg-gray-50'}
                        `}
                      >
                        <span className={`truncate max-w-[80%] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-600 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200/10">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`
                  px-6 py-3 rounded-lg font-semibold transition-colors
                  ${isDark 
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white shadow-lg
                  bg-gradient-to-r from-emerald-500 to-emerald-600
                  hover:from-emerald-600 hover:to-emerald-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transform transition-all duration-200 hover:scale-[1.02]
                `}
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
