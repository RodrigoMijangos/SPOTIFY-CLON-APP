export interface SpotifySearch {
    tracks: {
    items: Array<{
      id: string;
      name: string;
      duration_ms: number;
      href: string;
      artists: Array<{
        id: string;
        name: string;
        href: string;
      }>;
      album: {
        images: Array<{
          url: string;
          width: number;
          height: number;
        }>;
      };
    }>;
  };
}

