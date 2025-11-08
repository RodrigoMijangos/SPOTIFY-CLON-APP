export interface Track {
    id: string,
    name: string,
    duration_ms: number,
    href: string,
    preview_url?: string, //espera un undefined, pero mejor el ? para ahorrar
    artists: {
        id: string;
        name: string;
    }[];
}