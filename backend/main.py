import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uvicorn
import requests
from pydantic import BaseModel

# Load environment variables from .env file
load_dotenv()

# Create FastAPI app instance
app = FastAPI(
    title="Playlist Analyzer API",
    description="Backend API for analyzing Spotify playlists",
    version="0.1.0"
)

# Get Spotify credentials from environment variables
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")

# Configure CORS to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Frontend URL (localhost)
        "http://127.0.0.1:3000"       # Frontend URL (127.0.0.1) - for Spotify OAuth consistency
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for OAuth flow
class AuthCodeRequest(BaseModel):
    """Request model for authorization code from frontend"""
    code: str

class TokenResponse(BaseModel):
    """Response model for Spotify access tokens"""
    access_token: str
    refresh_token: str
    expires_in: int
    token_type: str

# Root endpoint - basic health check
@app.get("/")
async def root():
    return {
        "message": "🎵 Playlist Analyzer API is running!",
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "0.1.0",
        "spotify_integration": "✅ Ready" if SPOTIFY_CLIENT_ID else "❌ Missing credentials"
    }

# Test endpoint for frontend communication
@app.get("/api/test")
async def test_endpoint():
    return {
        "message": "Backend communication successful!",
        "frontend_can_reach_backend": True,
        "ready_for_spotify_integration": True,
        "spotify_client_id_configured": SPOTIFY_CLIENT_ID is not None,
        "redirect_uri": SPOTIFY_REDIRECT_URI
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "dependencies": {
            "fastapi": "✅ Working",
            "uvicorn": "✅ Working", 
            "cors": "✅ Configured",
            "python": "✅ Running",
            "spotify_credentials": "✅ Loaded" if SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET else "❌ Missing"
        },
        "environment": {
            "spotify_client_id": SPOTIFY_CLIENT_ID[:8] + "..." if SPOTIFY_CLIENT_ID else "Not configured",
            "redirect_uri": SPOTIFY_REDIRECT_URI
        }
    }

# OAuth endpoint - Exchange authorization code for access tokens
@app.post("/auth/token", response_model=TokenResponse)
async def exchange_code_for_token(auth_request: AuthCodeRequest):
    """
    Exchange Spotify authorization code for access and refresh tokens.
    
    This is the secure server-side part of the OAuth flow:
    1. Frontend sends us the authorization code from Spotify
    2. We exchange it with Spotify for actual access tokens
    3. We return the tokens to the frontend for API calls
    """
    
    # Validate that we have the required credentials
    if not SPOTIFY_CLIENT_ID or not SPOTIFY_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Spotify credentials not configured on server"
        )
    
    # Spotify's token exchange endpoint
    token_url = "https://accounts.spotify.com/api/token"
    
    # Data required by Spotify OAuth 2.0 specification
    token_data = {
        "grant_type": "authorization_code",
        "code": auth_request.code,
        "redirect_uri": SPOTIFY_REDIRECT_URI,
        "client_id": SPOTIFY_CLIENT_ID,
        "client_secret": SPOTIFY_CLIENT_SECRET,
    }
    
    # Headers required by Spotify API
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    try:
        # Make the secure request to Spotify
        print(f"Exchanging authorization code for tokens...")
        response = requests.post(token_url, data=token_data, headers=headers)
        
        # Check if the exchange was successful
        if response.status_code == 200:
            token_info = response.json()
            print(f"✅ Successfully obtained tokens from Spotify")
            
            return TokenResponse(
                access_token=token_info["access_token"],
                refresh_token=token_info["refresh_token"],
                expires_in=token_info["expires_in"],
                token_type=token_info["token_type"]
            )
        else:
            # Log detailed error for debugging
            error_detail = response.text
            print(f"❌ Spotify token exchange failed: {response.status_code} - {error_detail}")
            
            raise HTTPException(
                status_code=400, 
                detail=f"Spotify authentication failed: {error_detail}"
            )
            
    except requests.RequestException as e:
        print(f"❌ Network error during token exchange: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Failed to communicate with Spotify API"
        )

# OAuth helper endpoint - Get Spotify authorization URL
@app.get("/auth/url")
async def get_spotify_auth_url():
    """
    Generate the Spotify authorization URL for the frontend to redirect users to.
    This URL includes all the required OAuth parameters.
    """
    
    if not SPOTIFY_CLIENT_ID:
        raise HTTPException(
            status_code=500,
            detail="Spotify Client ID not configured"
        )
    
    # Spotify OAuth 2.0 authorization URL with required parameters
    auth_url = (
        "https://accounts.spotify.com/authorize?"
        f"client_id={SPOTIFY_CLIENT_ID}&"
        "response_type=code&"
        f"redirect_uri={SPOTIFY_REDIRECT_URI}&"
        "scope=user-read-private user-read-email playlist-read-private playlist-read-collaborative"
    )
    
    return {
        "auth_url": auth_url,
        "redirect_uri": SPOTIFY_REDIRECT_URI,
        "scopes": [
            "user-read-private",
            "user-read-email", 
            "playlist-read-private",
            "playlist-read-collaborative"
        ]
    }

# Run the app if this file is executed directly
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)