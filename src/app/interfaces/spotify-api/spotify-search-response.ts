import { SpotifyTrackResponse } from "./spotify-track-response"; 

export interface SpotifySearchResponse {

    tracks:{
        items: SpotifyTrackResponse[];
    };
}