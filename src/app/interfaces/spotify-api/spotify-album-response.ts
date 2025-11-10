// src/app/interfaces/spotify-api/spotify-album-response.ts
import { SpotifyArtistResponse } from "./spotify-artist-response"; // <-- Necesaria
import { SpotifyImageResponse } from "./spotify-image-response";
import { SpotifyTrackResponse } from "./spotify-track-response";

export interface SpotifyAlbumResponse {
  id: string;
  name: string;
  total_tracks: number;
  href: string;
  images: SpotifyImageResponse[];
  
  // --- ¡ARREGLO 3! ---
  // Esta propiedad faltaba para que .artists.at(0) funcione
  artists: SpotifyArtistResponse[]; 

  // (Esta la dejamos por si la respuesta completa la trae)
  tracks?: {
    href: string;
    total: number;
    items: SpotifyTrackResponse[];
  };
}