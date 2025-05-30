import React, { useState, useEffect } from 'react';
import './App.css';

interface BackendTest {
  message: string;
  frontend_can_reach_backend: boolean;
  ready_for_spotify_integration: boolean;
}

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Testing...');
  const [backendData, setBackendData] = useState<BackendTest | null>(null);

  useEffect(() => {
    // Test backend connection
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-spotify-green mb-4">
          🎵 Playlist Analyzer
        </h1>
        <p className="text-white text-xl mb-8">
          Discover the psychology behind your music taste
        </p>
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-spotify-black mb-4">
            Setup Test Status
          </h2>
          <div className="space-y-2 text-left">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span>React & TypeScript: Working</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span>Tailwind CSS: Working</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span>Custom Spotify Colors: Working</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">{backendStatus.includes('✅') ? '✅' : '⏳'}</span>
              <span>Backend Connection: {backendStatus}</span>
            </div>
          </div>
          
          {backendData && (
            <div className="mt-4 p-3 bg-green-50 rounded border">
              <p className="text-sm text-green-800 font-semibold">Backend Response:</p>
              <p className="text-xs text-green-600">{backendData.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;