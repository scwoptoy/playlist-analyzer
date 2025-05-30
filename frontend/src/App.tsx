import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Callback from './components/Callback';
import Dashboard from './pages/Dashboard';
import { Playlists } from './pages/Playlists';
import './App.css';

// Protected Route component - only shows content if user is authenticated
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spotify-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show protected content if authenticated
  return <>{children}</>;
};

// Main App Router component (needs to be inside AuthProvider)
const AppRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Login route - redirect to dashboard if already authenticated */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        
        {/* OAuth callback route */}
        <Route path="/callback" element={<Callback />} />
        
        {/* Protected dashboard route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* NEW: Protected playlists route */}
        <Route 
          path="/playlists" 
          element={
            <ProtectedRoute>
              <Playlists />
            </ProtectedRoute>
          } 
        />
        
        {/* Default route - redirect based on auth status */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } 
        />
        
        {/* Catch-all route for 404s */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen bg-gradient-to-br from-spotify-black to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
                <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="bg-spotify-green text-black px-6 py-2 rounded-lg font-semibold hover:bg-green-400 transition"
                >
                  Go Home
                </button>
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

// Main App component - wraps everything with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;