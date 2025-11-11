import { SpotifyAlbumResponse } from "./spotify-album-response";
import { SpotifyArtistResponse } from "./spotify-artist-response";
import { SpotifyTrackResponse } from "./spotify-track-response";

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrackResponse[];
    total: number;
  };
  artists: {
    items: SpotifyArtistResponse[];
    total: number;
  };
  albums: {
    items: SpotifyAlbumResponse[]; 
    total: number;
  };
}