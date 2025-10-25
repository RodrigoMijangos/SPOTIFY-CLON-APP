// src/app/services/auth.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, tap, catchError } from 'rxjs';
import { CookiesStorageService } from './cookie-storage-service'; // Asegúrate de la ruta correcta

@Injectable({
  providedIn: 'root' // disponible en toda la aplicación
})
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookiesStorageService);
  private readonly REFRESH_ENDPOINT = 'https://accounts.spotify.com/api/token/refresh'; 

  isRefreshing = false; 
  // para notificar a las peticiones en cola el nuevo token
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null); 

  public getAccessToken(): string | null {
    return this.cookieService.getCookie('access_token');
  }
  
  public getRefreshToken(): string | null {
    // asume que también guardas el refresh_token en una cookie
    return this.cookieService.getCookie('refresh_token'); 
  }


  public refreshToken(): Observable<any> {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null); // bloquea la cola de peticiones

    const token = this.getRefreshToken();
    if (!token) {
        this.signOut(); 
        return throwError(() => new Error('No refresh token disponible.'));
    }

    return this.http.post(this.REFRESH_ENDPOINT, { refreshToken: token }).pipe(
      tap((response: any) => {
        const expireTimeMS = 60 * 60 * 1000; 
        const expireDate = new Date(Date.now() + expireTimeMS);
        
        this.cookieService.setCookie('access_token', response.access_token, expireDate);
        
        if (response.refresh_token) {
          this.cookieService.setCookie('refresh_token', response.refresh_token, expireDate);
        }

        this.isRefreshing = false;
        this.refreshTokenSubject.next(response.access_token);
      }),
      catchError((error: HttpErrorResponse) => {
        this.isRefreshing = false;
        this.signOut(); 
        return throwError(() => error);
      })
    );
  }

  
  public signOut(): void {
    // limpia ambos tokens
    this.cookieService.deleteCookie('access_token');
    this.cookieService.deleteCookie('refresh_token'); 
    
  }
}