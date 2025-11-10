export interface Track {
  id: string;
  name: string;
  preview_url?: string;
  duration_ms: number;
  popularity?: number;
  artists: Artist[];
  album: Album;
  external_urls?: {
    spotify?: string;
  };
}

export interface Artist {
  id: string;
  name: string;
}

export interface Album {
  id: string;
  name: string;
  images: Image[];
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface SearchResult {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
}