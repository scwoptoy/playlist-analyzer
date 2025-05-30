import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface BackendTest {
  message: string;
  frontend_can_reach_backend: boolean;
  ready_for_spotify_integration: boolean;
}

const Dashboard: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [backendStatus, setBackendStatus] = useState<string>('Testing...');
  const [backendData, setBackendData] = useState<BackendTest | null>(null);

  useEffect(() => {
    // Test backend connection (keeping your original test)
    fetch('http://localhost:8000/api/test')
      .then(response => response.json())
      .then((data: BackendTest) => {
        setBackendData(data);
        setBackendStatus('✅ Connected');
      })
      .catch(error => {
        console.error('Backend connection failed:', error);
        setBackendStatus('❌ Failed');
      });
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleViewPlaylists = () => {
    navigate('/playlists');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spotify-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black to-gray-900">
      {/* Header with user info and logout */}
      <header className="bg-black bg-opacity-50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-spotify-green">🎵 Playlist Analyzer</h1>
              {user && (
                <div className="flex items-center space-x-3">
                  {user.images?.[0] && (
                    <img 
                      src={user.images[0].url} 
                      alt={user.display_name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-white font-medium">{user.display_name}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome back, {user?.display_name}! 🎉
          </h2>
          <p className="text-gray-300 text-xl mb-8">
            You're successfully connected to Spotify. Let's analyze your music taste!
          </p>
          
          {/* NEW: Main Action Button */}
          <button
            onClick={handleViewPlaylists}
            className="bg-spotify-green hover:bg-green-400 text-black px-8 py-4 rounded-lg text-xl font-bold transition transform hover:scale-105 shadow-lg"
          >
            🎵 View My Playlists
          </button>
        </div>

        {/* Status cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Authentication Status */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-spotify-black mb-4">
              🔐 Authentication Status
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span>Spotify Connected</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span>User Profile Loaded</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span>Access Token Valid</span>
              </div>
            </div>
          </div>

          {/* Backend Connection */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-spotify-black mb-4">
              🔧 Backend Connection
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span>React & TypeScript</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span>Tailwind CSS</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">{backendStatus.includes('✅') ? '✅' : '⏳'}</span>
                <span>Backend API: {backendStatus}</span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-spotify-black mb-4">
              👤 Your Spotify Profile
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {user?.display_name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Spotify ID:</strong> {user?.id}</p>
              <p><strong>Profile Image:</strong> {user?.images?.length ? '✅ Available' : '❌ None'}</p>
            </div>
          </div>
        </div>

        {/* Backend Response */}
        {backendData && (
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Backend Response:</h3>
            <p className="text-green-700">{backendData.message}</p>
            <div className="mt-2 text-sm text-green-600">
              <p>Frontend can reach backend: {backendData.frontend_can_reach_backend ? '✅' : '❌'}</p>
              <p>Ready for Spotify integration: {backendData.ready_for_spotify_integration ? '✅' : '❌'}</p>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="mt-12 bg-gray-800 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-white mb-4">🚀 What's Next?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-spotify-green">Available Now:</h4>
              <ul className="space-y-2 text-gray-300">
                <li>✅ View your Spotify playlists</li>
                <li>✅ Browse playlist details</li>
                <li>✅ Open playlists in Spotify</li>
                <li>⏳ Playlist analysis (coming soon)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-spotify-green">Coming Soon:</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Analyze playlist audio features</li>
                <li>• Generate taste insights</li>
                <li>• Personalized recommendations</li>
                <li>• Playlist comparisons</li>
              </ul>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleViewPlaylists}
              className="bg-spotify-green hover:bg-green-400 text-black px-6 py-3 rounded-lg font-semibold transition"
            >
              View My Playlists
            </button>
            <button
              onClick={() => alert('Analysis feature coming soon!')}
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Start Analysis (Coming Soon)
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;