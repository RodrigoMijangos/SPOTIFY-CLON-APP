import { SpotifyAlbumResponse } from "./spotify-album-response"; 
import { SpotifyArtistResponse } from "./spotify-artist-response"; 

export interface SpotifyTrackResponse {
  id: string;
  name: string;
  duration_ms: number;
  href: string;
  preview_url: string;
  artists: SpotifyArtistResponse[]; 
  album: SpotifyAlbumResponse; 
}