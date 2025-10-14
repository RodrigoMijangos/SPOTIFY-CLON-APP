import { TrackResponse } from "./track-response"

export interface PlaylistResponse {

    id: string,
    name: string,
    collaborative: boolean,
    description: string,
    tracks: {
        href:string,
        items: [
            {
                track: TrackResponse
            }
        ]
    }

}
