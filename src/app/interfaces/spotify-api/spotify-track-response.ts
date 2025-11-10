// src/app/interfaces/spotify-api/spotify-track-response.ts
import { SpotifyAlbumResponse } from "./spotify-album-response"; // <-- Necesaria
import { SpotifyArtistResponse } from "./spotify-artist-response"; // <-- Necesaria

export interface SpotifyTrackResponse {
  id: string;
  name: string;
  duration_ms: number;
  href: string;
  preview_url: string;
  artists: SpotifyArtistResponse[]; // <-- Debe ser un array de Artistas
  
  // --- ¡ARREGLO 2! ---
  // Esta propiedad faltaba para que .album.images funcione
  album: SpotifyAlbumResponse; 
}