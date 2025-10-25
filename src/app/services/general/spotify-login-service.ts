import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EnvironmentConfig } from 'src/environments/environment.interface';

@Injectable({
  providedIn: 'root'
})
export class SpotifyLoginService {
  
  private env : EnvironmentConfig = environment as EnvironmentConfig;
  constructor(
    private _http:HttpClient
  ){  }

  getAccessToken(): Observable<any> {

    const body = new HttpParams()
      .set('grant_type','client_credentials')
      .set('client_id',this.env.CLIENT_ID)
      .set('client_secret',this.env.CLIENT_SECRET);

    return this._http.post<any>(
      this.env.AUTH_API_URL,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${this.env.CLIENT_ID}:${this.env.CLIENT_SECRET}`)
        }
      }
    );
  }

}
