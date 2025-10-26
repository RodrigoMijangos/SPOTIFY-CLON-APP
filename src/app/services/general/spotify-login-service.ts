import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyLoginService {
  
  private http = inject(HttpClient);
  
  constructor() { }

  getAccessToken(): Observable<any> {
    console.log('CLIENT_ID:', environment.CLIENT_ID);
    console.log('CLIENT_ID length:', environment.CLIENT_ID.length);
    console.log('CLIENT_SECRET:', environment.CLIENT_SECRET);
    console.log('CLIENT_SECRET length:', environment.CLIENT_SECRET.length);
    
    const body = `grant_type=client_credentials&client_id=${environment.CLIENT_ID}&client_secret=${environment.CLIENT_SECRET}`;
    
    console.log('Body generado:', body);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>(
      environment.AUTH_API_URL,
      body,
      { headers }
    );
  }
}