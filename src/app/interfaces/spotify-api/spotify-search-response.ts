export interface SpotifySearchResponse {
    albums?: {
        items: {
            id: string;
            name: string;
            total_tracks: number;
            images: {
                url: string;
                height: number;
                width: number;
            }[];
            href: string;
        }[];
    };
    artists?: {
        items: {
            id: string;
            name: string;
            images: {
                url: string;
                height: number;
                width: number;
            }[];
            href: string;
        }[];
    };
}