import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        toast.show('Invalid verification link', 'error');
        return;
      }

      try {
        // Call backend to verify token
        await axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        
        setStatus('success');
        // Removed toast to avoid duplicate notifications
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        toast.show(error.response?.data?.error || 'Verification failed', 'error');
      }
    };

    verify();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Verifying Email...</h2>
            <p className="text-gray-400">Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-green-500">Verified!</h2>
            <p className="text-gray-400 mb-4">Your email has been successfully verified.</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-red-500">Verification Failed</h2>
            <p className="text-gray-400 mb-4">The verification link is invalid or has expired.</p>
            <button 
              onClick={() => navigate('/signin')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
