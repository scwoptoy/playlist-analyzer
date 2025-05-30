from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uvicorn

# Create FastAPI app instance
app = FastAPI(
    title="Playlist Analyzer API",
    description="Backend API for analyzing Spotify playlists",
    version="0.1.0"
)

# Configure CORS to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint - basic health check
@app.get("/")
async def root():
    return {
        "message": "🎵 Playlist Analyzer API is running!",
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "0.1.0"
    }

# Test endpoint for frontend communication
@app.get("/api/test")
async def test_endpoint():
    return {
        "message": "Backend communication successful!",
        "frontend_can_reach_backend": True,
        "ready_for_spotify_integration": True
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
            "python": "✅ Running"
        }
    }

# Run the app if this file is executed directly
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)