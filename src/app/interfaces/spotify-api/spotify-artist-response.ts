import { SpotifyImageResponse } from "./spotify-image-response";

export interface SpotifyArtistResponse {
  id: string;
  name: string;
  href: string;
  images: SpotifyImageResponse[];
  genres: string[];
  popularity: number;
}