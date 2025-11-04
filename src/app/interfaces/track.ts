export interface Track {
    id: string,
    name: string,
    duration_ms: number,
    href: string,
    preview_url?: string | null,
    artists: {
        id: string,
        name: string
    }[]
}
