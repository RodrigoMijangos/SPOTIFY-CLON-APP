import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { spotify_environments } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SpotifyLoginService {
  
  constructor(
    private _http:HttpClient
  ){  }

  getAccessToken(): Observable<any> {

    const body = new HttpParams()
      .set('grant_type','client_credentials')
      .set('client_id','427ffe08ec7f49ebac94d0e35e1ada88')
      .set('client_secret','2939401163774f67961f147d13ec0fb9');

    return this._http.post<any>(
      spotify_environments.AUTH_API_URL,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
  }

}
