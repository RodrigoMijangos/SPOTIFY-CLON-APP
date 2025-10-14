export interface TrackResponse {

    id: string,
    preview_url:any,
    artists: [
        {
            id: string,
            name: string,
        }
    ]
    track_number: number,
    duration_ms: number,
    href:string,

}
