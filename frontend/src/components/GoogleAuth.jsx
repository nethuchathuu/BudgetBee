import React from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import google from '../assets/google_log.png';
import { useToast } from '../context/ToastContext';

export default function GoogleAuth({ text = "Continue with Google" }) {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const toast = useToast();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Send user info to backend
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });

      // Save token and user info
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      if (res.data.user) {
        localStorage.setItem('user_id', res.data.user.id);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      toast.show('Google Sign-In successful!', 'success');
      navigate('/home');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      toast.show('Could not sign in with Google', 'error');
    }
  };

  return (
    <button 
      type="button" 
      onClick={handleGoogleClick}
      className="w-full bg-white text-gray-900 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-gray-100 transition"
    >
      <img src={google} alt="Google" className="w-5 h-5" />
      {text}
    </button>
  );
}
