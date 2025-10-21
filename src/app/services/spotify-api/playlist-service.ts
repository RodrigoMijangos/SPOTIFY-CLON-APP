import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlaylistResponse } from '../../interfaces/album';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private _http: HttpClient){}

  getPlaylist(token: string): Observable<PlaylistResponse> {
    console.log(token)
    return this._http.get<PlaylistResponse>("https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n", {headers:{
      "Authorization": "Bearer " + token
    }});
  }
  
}
