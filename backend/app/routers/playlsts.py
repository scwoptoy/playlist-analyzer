from fastapi import APIRouter, HTTPException, Header
import httpx
from typing import Optional, List, Dict, Any

router = APIRouter(prefix="/api/playlists", tags=["playlists"])

@router.get("/")
async def get_user_playlists(authorization: str = Header(...)):
    """
    Fetch user's Spotify playlists using their access token
    
    Args:
        authorization: Bearer token from Authorization header
    
    Returns:
        List of user's playlists with essential information
    """
    try:
        # Extract the access token from "Bearer <token>" format
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization format")
        
        access_token = authorization.replace("Bearer ", "")
        
        # Make request to Spotify API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.spotify.com/v1/me/playlists",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json"
                },
                params={
                    "limit": 50,  # Get up to 50 playlists at once
                    "offset": 0   # Start from the beginning
                }
            )
        
        # Handle Spotify API errors
        if response.status_code == 401:
            raise HTTPException(status_code=401, detail="Invalid or expired access token")
        elif response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Spotify API error")
        
        # Parse the response
        spotify_data = response.json()
        
        # Extract and simplify the playlist data
        playlists = []
        for playlist in spotify_data.get("items", []):
            playlist_info = {
                "id": playlist["id"],
                "name": playlist["name"],
                "description": playlist.get("description", ""),
                "tracks_total": playlist["tracks"]["total"],
                "owner": playlist["owner"]["display_name"],
                "is_public": playlist["public"],
                "image_url": playlist["images"][0]["url"] if playlist["images"] else None,
                "external_url": playlist["external_urls"]["spotify"]
            }
            playlists.append(playlist_info)
        
        return {
            "playlists": playlists,
            "total": spotify_data.get("total", len(playlists))
        }
        
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Unable to connect to Spotify API")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")