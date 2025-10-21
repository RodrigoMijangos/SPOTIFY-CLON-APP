import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpotifyAlbumResponse } from '../../interfaces/spotify-api/spotify-album-response';
import { Observable } from 'rxjs';
import { spotify_environments } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAlbumService {

  constructor(
    private _http:HttpClient
  ){}

  getAlbum(id: string): Observable<SpotifyAlbumResponse>{
    return this._http.get<SpotifyAlbumResponse>(
      `${spotify_environments.API_URL}/albums/${id}`,
      {
        
      }
    )
  }
  
}
