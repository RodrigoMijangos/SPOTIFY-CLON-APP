import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EnvironmentConfig } from 'src/environments/environment.interface';

@Injectable({
  providedIn: 'root'
})
export class SpotifyLoginService {
  
  private env: EnvironmentConfig = environment as EnvironmentConfig;
  
  constructor(
    private _http: HttpClient
  ) { }

  getAccessToken(): Observable<any> {
    // ✅ Envía todo en el body, igual que el curl que funcionó
    const body = `grant_type=client_credentials&client_id=${this.env.CLIENT_ID}&client_secret=${this.env.CLIENT_SECRET}`;
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    console.log('🔑 Enviando petición con body:', body);

    return this._http.post<any>(
      this.env.AUTH_API_URL,
      body,
      { headers }
    );
  }
}