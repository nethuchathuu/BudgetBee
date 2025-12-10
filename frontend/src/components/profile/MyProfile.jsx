import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Mail, User, Lock, Check, X, Moon, Sun, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import NavProfile from '../NavProfile';
import './MyProfile.css';

export default function MyProfile() {
  const { isDark, theme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();

  // User info state
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    theme: '',
    createdAt: '',
    profilePicture: null
  });

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/signin';
  };

  const fetchUserProfile = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');

      // Check if userId exists, if not use fallback
      if (!userId) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setProfileData({
          fullName: user.fullname || '',
          email: user.email || '',
          profilePicture: null
        });
        toast.show('Please sign in again to sync your profile data', 'warning');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/user/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const userData = response.data.data;
        // Load profile picture from localStorage
        const savedPicture = localStorage.getItem(`budgetbee-profile-pic-${userId}`);
        
        setProfileData({
          fullName: userData.fullname || '',
          email: userData.email || '',
          theme: userData.theme || 'light',
          createdAt: userData.created_at || '',
          profilePicture: savedPicture || null
        });
        
        if (savedPicture) {
          setProfilePreview(savedPicture);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = localStorage.getItem('user_id');
      const savedPicture = localStorage.getItem(`budgetbee-profile-pic-${userId}`);
      const savedTheme = localStorage.getItem('budgetbee-theme');
      
      setProfileData({
        fullName: user.fullname || '',
        email: user.email || '',
        theme: savedTheme || 'light',
        createdAt: new Date().toISOString(),
        profilePicture: savedPicture || null
      });
      
      if (savedPicture) {
        setProfilePreview(savedPicture);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.show('Image size should be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setProfilePreview(imageData);
        setProfileData({ ...profileData, profilePicture: imageData });
        
        // Save to localStorage immediately
        const userId = localStorage.getItem('user_id');
        localStorage.setItem(`budgetbee-profile-pic-${userId}`, imageData);
        toast.show('Profile picture updated!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');

      const response = await axios.put(
        `http://localhost:5000/api/user/updateName`,
        {
          userId: userId,
          fullName: profileData.fullName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.show('Profile updated successfully!', 'success');
        setIsEditing(false);
        setProfilePreview(null);
        fetchUserProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.show('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <NavProfile />
      <div className={`min-h-screen pt-20 ${isDark ? 'bg-[#0c111c]' : 'bg-gray-100'} py-8 px-4`}>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/home', { replace: true })}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'hover:bg-gray-800 text-emerald-400' 
                : 'hover:bg-gray-200 text-emerald-600'
            }`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            My Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className={`rounded-2xl shadow-xl backdrop-blur-lg p-8 space-y-6 ${
          isDark 
            ? 'bg-[#1a1f2c]/80 border border-emerald-400/20' 
            : 'bg-white/80 border border-gray-200'
        }`}>
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${
                isDark ? 'border-emerald-400/30' : 'border-emerald-500/30'
              }`}>
                {profilePreview || profileData.profilePicture ? (
                  <img
                    src={profilePreview || profileData.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <User className={`w-16 h-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                )}
              </div>
              {isEditing && (
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 p-2 bg-emerald-500 rounded-full cursor-pointer hover:bg-emerald-600 transition-colors shadow-lg"
                >
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className={`mt-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {isEditing ? 'Click camera to change picture' : ''}
            </p>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all ${
                  isDark 
                    ? 'bg-[#0c111c] text-white border-gray-700 focus:border-emerald-400' 
                    : 'bg-white text-gray-800 border-gray-300 focus:border-emerald-500'
                } ${!isEditing && 'cursor-not-allowed opacity-70'}`}
              />
            </div>

            {/* Email */}
            <div>
              <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                disabled
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none cursor-not-allowed opacity-70 ${
                  isDark 
                    ? 'bg-[#0c111c] text-gray-400 border-gray-700' 
                    : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              />
              <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Email cannot be edited for security reasons
              </p>
            </div>

            {/* Theme */}
            <div>
              <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                Current Theme
              </label>
              <input
                type="text"
                value={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                disabled
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none cursor-not-allowed opacity-70 ${
                  isDark 
                    ? 'bg-[#0c111c] text-gray-400 border-gray-700' 
                    : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              />
              <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Change theme in Settings → Appearance
              </p>
            </div>

            {/* Account Created Date */}
            <div>
              <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Calendar className="w-4 h-4" />
                Account Created
              </label>
              <input
                type="text"
                value={formatDate(profileData.createdAt)}
                disabled
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none cursor-not-allowed opacity-70 ${
                  isDark 
                    ? 'bg-[#0c111c] text-gray-400 border-gray-700' 
                    : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate('/profile/change-password')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setProfilePreview(null);
                    fetchUserProfile();
                  }}
                  disabled={isSaving}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
          
          {/* Logout Button */}
          <button className='logout-btn' onClick={() => setShowLogoutPopup(true)}>Logout</button>
        </div>
      </div>
    </div>

    {/* Logout Popup */}
    {showLogoutPopup && (
      <div className='logout-popup-overlay'>
        <div className='logout-popup-box'>
          <h3>Confirm Logout</h3>
          <p>Are you sure you want to logout?</p>
          <div className='popup-actions'>
            <button onClick={() => setShowLogoutPopup(false)} className='cancel-btn'>Cancel</button>
            <button onClick={handleLogout} className='confirm-btn'>Logout</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
