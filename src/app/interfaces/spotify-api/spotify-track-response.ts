export interface SpotifyTrackResponse {
  id: string;
  name: string;
  duration_ms: number;
  href: string;
  preview_url?: string;
  artists: {
    id: string;
    name: string;
    href: string;
  }[];
  album?: {
    images: {
      url: string;
      width: number;
      height: number;
    }[];
  };
}
