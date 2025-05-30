import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PlaylistService, PlaylistInfo, PlaylistsResponse } from '../services/playlistService';
import { PlaylistList } from '../components/PlaylistList';

export const Playlists: React.FC = () => {
  // Get user authentication state
  const { user, tokens, isAuthenticated } = useAuth();
  
  // Component state for playlists
  const [playlists, setPlaylists] = useState<PlaylistInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch playlists when component mounts or tokens change
  useEffect(() => {
    const fetchPlaylists = async () => {
      // Make sure user is authenticated and we have tokens
      if (!isAuthenticated || !tokens?.access_token) {
        setError('Please log in to view your playlists');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('🎵 Starting playlist fetch...');
        const response: PlaylistsResponse = await PlaylistService.getUserPlaylists(tokens.access_token);
        
        setPlaylists(response.playlists);
        console.log(`✅ Successfully loaded ${response.playlists.length} playlists`);
        
      } catch (err) {
        console.error('❌ Error loading playlists:', err);
        setError(err instanceof Error ? err.message : 'Failed to load playlists');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [isAuthenticated, tokens]);

  // Handle playlist selection (for future analysis feature)
  const handlePlaylistSelect = (playlist: PlaylistInfo) => {
    console.log(`🎯 User selected playlist: ${playlist.name}`);
    // TODO: Navigate to analysis page or show analysis modal
    alert(`Analysis feature coming soon!\n\nSelected: ${playlist.name}\nTracks: ${playlist.tracks_total}`);
  };

  // Render the page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Playlists</h1>
              {user && (
                <p className="text-gray-600 mt-2">
                  Welcome back, {user.display_name}! Ready to analyze your music taste?
                </p>
              )}
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={() => window.location.reload()}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PlaylistList
          playlists={playlists}
          loading={loading}
          error={error}
          onPlaylistSelect={handlePlaylistSelect}
        />
      </div>

      {/* Footer with Stats */}
      {!loading && !error && playlists.length > 0 && (
        <div className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-gray-600">
              <p>
                🎵 Total Playlists: <span className="font-semibold">{playlists.length}</span> | 
                📊 Total Tracks: <span className="font-semibold">
                  {playlists.reduce((sum, playlist) => sum + playlist.tracks_total, 0)}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};