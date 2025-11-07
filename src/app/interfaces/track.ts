export interface Track {
    id: string,
    name: string,
    duration_ms: number,
    href: string,
    artists: {
        id: string,
        name: string
    }[],
    album?: {
        id: string,
        name: string,
        images?: {
            url: string,
            height: number,
            width: number
        }[]
    },
    preview_url?: string,
    external_urls?: {
        spotify: string
    },
    popularity?: number,
    track_number?: number,
    type?: string,
    uri?: string,
    is_local?: boolean
}
