import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  constructor(
    private _http: HttpClient
    
  ){}

  getAccessToken(): Observable<any>{

    const body = new URLSearchParams();
    body.set("grant_type", "client_credentials");
    body.set("client_id", "9f355a2b99db4d339a0043569db157b2");
    body.set("client_secret", "4a1734110bfa4fcdbc97ab9d9fdc978e");

    return this._http.post<any>("https://accounts.spotify.com/api/token", body.toString(), {
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

}
