import { SpotifyArtistResponse } from "./spotify-artist-response"; 
import { SpotifyImageResponse } from "./spotify-image-response";
import { SpotifyTrackResponse } from "./spotify-track-response";

export interface SpotifyAlbumResponse {
  id: string;
  name: string;
  total_tracks: number;
  href: string;
  images: SpotifyImageResponse[];
  
  artists: SpotifyArtistResponse[]; 
  tracks?: {
    href: string;
    total: number;
    items: SpotifyTrackResponse[];
  };
}