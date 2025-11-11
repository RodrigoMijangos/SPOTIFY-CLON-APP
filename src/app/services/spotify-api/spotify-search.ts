import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroments } from '../../../environments/environment.development';
import { SpotifySearchResponse } from '../../interfaces/spotify-api/spotify-search-response';

@Injectable({
  providedIn: 'root'
})
export class SpotifySearchService {

  private _http = inject(HttpClient);

  search(query: string): Observable<SpotifySearchResponse> {

    const params = {
      q: query,
      type: 'track,artist,album', 
      market: 'US', 
      limit: '10' 
    };

    return this._http.get<SpotifySearchResponse>(
      `${enviroments.API_URL}/search`, 
      { params } 
    );
  }
}