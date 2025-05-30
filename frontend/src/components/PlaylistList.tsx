import React from 'react';
import { PlaylistInfo } from '../services/playlistService';

interface PlaylistListProps {
  playlists: PlaylistInfo[];
  loading: boolean;
  error: string | null;
  onPlaylistSelect?: (playlist: PlaylistInfo) => void;
}

export const PlaylistList: React.FC<PlaylistListProps> = ({
  playlists,
  loading,
  error,
  onPlaylistSelect
}) => {
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <span className="ml-3 text-lg text-gray-600">Loading your playlists...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-lg font-semibold mb-2">
          ❌ Unable to Load Playlists
        </div>
        <div className="text-red-700">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show empty state
  if (playlists.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          🎵 No playlists found
        </div>
        <div className="text-gray-400">
          Create some playlists in Spotify and they'll appear here!
        </div>
      </div>
    );
  }

  // Show playlists grid
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your Spotify Playlists
        </h2>
        <p className="text-gray-600">
          Found {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
            onClick={() => onPlaylistSelect?.(playlist)}
          >
            {/* Playlist Image */}
            <div className="aspect-square w-full bg-gray-200 rounded-t-lg overflow-hidden">
              {playlist.image_url ? (
                <img
                  src={playlist.image_url}
                  alt={`${playlist.name} cover`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                  <span className="text-4xl">🎵</span>
                </div>
              )}
            </div>

            {/* Playlist Info */}
            <div className="p-4">
              {/* Playlist Name */}
              <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">
                {playlist.name}
              </h3>

              {/* Description */}
              {playlist.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {playlist.description}
                </p>
              )}

              {/* Metadata */}
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center justify-between">
                  <span>📊 {playlist.tracks_total} tracks</span>
                  <span>{playlist.is_public ? '🌐 Public' : '🔒 Private'}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>👤 by {playlist.owner}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlaylistSelect?.(playlist);
                  }}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Analyze
                </button>
                
                <a
                  href={playlist.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-gray-700 transition-colors text-center"
                >
                  Open in Spotify
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};