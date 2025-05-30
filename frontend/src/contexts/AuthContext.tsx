import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// TypeScript interfaces for our auth data
interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface User {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
}

interface AuthContextType {
  // Auth state
  isAuthenticated: boolean;
  user: User | null;
  tokens: SpotifyTokens | null;
  
  // Auth actions
  login: () => void;
  logout: () => void;
  exchangeCodeForTokens: (code: string) => Promise<boolean>;
  
  // Loading state
  isLoading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component props
interface AuthProviderProps {
  children: ReactNode;
}

// Main AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State management
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<SpotifyTokens | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Backend URL from environment
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  // Check for existing auth on component mount
  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      // Check if we have stored tokens in localStorage
      const storedTokens = localStorage.getItem('spotify_tokens');
      
      if (storedTokens) {
        const parsedTokens: SpotifyTokens = JSON.parse(storedTokens);
        
        // Check if tokens are still valid (basic check)
        if (parsedTokens.access_token) {
          setTokens(parsedTokens);
          await fetchUserProfile(parsedTokens.access_token);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error checking existing auth:', error);
      // Clear invalid stored data
      localStorage.removeItem('spotify_tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async (accessToken: string) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      
      // Get the Spotify authorization URL from our backend
      const response = await axios.get(`${BACKEND_URL}/auth/url`);
      const { auth_url } = response.data;
      
      // Redirect user to Spotify authorization page
      window.location.href = auth_url;
      
    } catch (error) {
      console.error('Error initiating login:', error);
      setIsLoading(false);
    }
  };

  const exchangeCodeForTokens = async (code: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Send authorization code to our backend for token exchange
      const response = await axios.post(`${BACKEND_URL}/auth/token`, {
        code: code,
      });
      
      const tokenData: SpotifyTokens = response.data;
      
      // Store tokens securely
      setTokens(tokenData);
      localStorage.setItem('spotify_tokens', JSON.stringify(tokenData));
      
      // Fetch user profile with the new access token
      await fetchUserProfile(tokenData.access_token);
      
      // Update auth state
      setIsAuthenticated(true);
      
      console.log('✅ Successfully authenticated with Spotify!');
      return true;
      
    } catch (error) {
      console.error('❌ Error exchanging code for tokens:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear all auth state
    setIsAuthenticated(false);
    setUser(null);
    setTokens(null);
    
    // Clear stored tokens
    localStorage.removeItem('spotify_tokens');
    
    console.log('✅ Successfully logged out');
  };

  // Context value object
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    tokens,
    login,
    logout,
    exchangeCodeForTokens,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};