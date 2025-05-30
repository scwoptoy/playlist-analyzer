import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();

  const handleLogin = () => {
    login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎵 Playlist Analyzer
          </h1>
          <p className="text-gray-600">
            Discover insights about your musical taste and get personalized recommendations
          </p>
        </div>

        {/* Features List */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">What you'll get:</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Deep analysis of your playlist preferences
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Personalized music recommendations
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Musical taste insights and patterns
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Discover new artists similar to your style
            </li>
          </ul>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`
            w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg
            transition duration-300 ease-in-out transform hover:scale-105
            flex items-center justify-center space-x-2
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
          `}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.32 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span>Connect with Spotify</span>
            </>
          )}
        </button>

        {/* Privacy Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            We only access your playlist data to provide insights. 
            <br />
            Your information is never shared or stored permanently.
          </p>
        </div>

        {/* Terms */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            By connecting, you agree to Spotify's terms and our privacy policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;