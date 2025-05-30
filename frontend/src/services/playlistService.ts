import axios from 'axios';

// Base URL for our backend API
const API_BASE_URL = 'http://localhost:8000';

// TypeScript interfaces for playlist data
export interface PlaylistInfo {
  id: string;
  name: string;
  description: string;
  tracks_total: number;
  owner: string;
  is_public: boolean;
  image_url: string | null;
  external_url: string;
}

export interface PlaylistsResponse {
  playlists: PlaylistInfo[];
  total: number;
}

// Playlist service class to handle all playlist-related API calls
export class PlaylistService {
  /**
   * Fetch user's Spotify playlists from our backend
   * 
   * @param accessToken - User's Spotify access token
   * @returns Promise with user's playlists
   */
  static async getUserPlaylists(accessToken: string): Promise<PlaylistsResponse> {
    try {
      console.log('🎵 Fetching user playlists...');
      
      const response = await axios.get<PlaylistsResponse>(
        `${API_BASE_URL}/api/playlists`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Successfully fetched ${response.data.playlists.length} playlists`);
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching playlists:', error);
      
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Your Spotify access token has expired. Please log in again.');
        } else if (error.response?.status === 503) {
          throw new Error('Unable to connect to Spotify. Please try again later.');
        } else {
          throw new Error(`Failed to fetch playlists: ${error.response?.data?.detail || error.message}`);
        }
      }
      
      // Generic error fallback
      throw new Error('An unexpected error occurred while fetching playlists.');
    }
  }
}