// src/app/interfaces/spotify-api/spotify-search-response.ts

import { SpotifyAlbumResponse } from "./spotify-album-response";
import { SpotifyArtistResponse } from "./spotify-artist-response";
import { SpotifyTrackResponse } from "./spotify-track-response";

export interface SpotifySearchResponse {
  // La respuesta tiene objetos para cada tipo que pedimos
  tracks: {
    items: SpotifyTrackResponse[];
    total: number;
  };
  artists: {
    items: SpotifyArtistResponse[];
    total: number;
  };
  albums: {
    // Reutilizamos la interfaz de Album que ya tenías
    items: SpotifyAlbumResponse[]; 
    total: number;
  };
}