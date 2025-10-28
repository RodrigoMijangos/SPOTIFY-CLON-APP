export interface Song {
  id: string;
  name: string;
  url: string;  // URL del preview o stream
  artists?: Array<{
    name: string;
    id: string;
  }>;
  album?: {
    name: string;
    images: Array<{
      url: string;
    }>;
  };
  duration_ms?: number;
  preview_url?: string;
}
