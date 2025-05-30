import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { exchangeCodeForTokens } = useAuth();
  
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing your Spotify authentication...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Parse URL parameters to get the authorization code
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      // Check if user denied authorization
      if (error) {
        setStatus('error');
        setMessage(`Authentication cancelled: ${error}`);
        
        // Redirect back to login after a delay
        setTimeout(() => {
          navigate('/');
        }, 3000);
        return;
      }

      // Check if we received the authorization code
      if (!code) {
        setStatus('error');
        setMessage('No authorization code received from Spotify');
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
        return;
      }

      // Exchange the code for tokens
      setMessage('Exchanging authorization code for access tokens...');
      const success = await exchangeCodeForTokens(code);

      if (success) {
        setStatus('success');
        setMessage('Successfully authenticated! Redirecting to your dashboard...');
        
        // Redirect to main app after successful auth
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setStatus('error');
        setMessage('Failed to complete authentication. Please try again.');
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }

    } catch (error) {
      console.error('Callback error:', error);
      setStatus('error');
      setMessage('An unexpected error occurred during authentication.');
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            🔐 Authenticating
          </h1>
        </div>

        {/* Status Display */}
        <div className="text-center">
          
          {/* Processing State */}
          {status === 'processing' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-600 font-semibold">{message}</p>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-600 font-semibold">{message}</p>
              <p className="text-gray-500 text-sm">You'll be redirected to the login page shortly...</p>
            </div>
          )}

        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>Current URL: {window.location.href}</p>
            <p>Search params: {location.search}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Callback;