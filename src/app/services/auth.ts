// src/app/services/auth.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, tap, catchError } from 'rxjs';
import { CookiesStorageService } from './cookie-storage-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookiesStorageService);
  
  private readonly REFRESH_ENDPOINT = 'https://accounts.spotify.com/api/token';

  isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  // obtener access token desde cookies
  public getAccessToken(): string | null {
    const token = this.cookieService.getCookie('spotify_access_token');
    return token || null;
  }

  // obtener refresh token desde cookies
  public getRefreshToken(): string | null {
    const token = this.cookieService.getCookie('spotify_refresh_token');
    return token || null;
  }

  public refreshToken(): Observable<any> {
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.signOut();
      return throwError(() => new Error('No refresh token disponible.'));
    }

    // spotify requiere estos parámetros para refresh
    const body = `grant_type=refresh_token&refresh_token=${refreshToken}`;
    const credentials = btoa(`${environment.CLIENT_ID}:${environment.CLIENT_SECRET}`);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`
    });

    return this.http.post(this.REFRESH_ENDPOINT, body, { headers }).pipe(
      tap((response: any) => {
        console.log('✅ Token refrescado:', response);
        
        const expireTimeMS = 60 * 60 * 1000;
        const expireDate = new Date(Date.now() + expireTimeMS);

        // Guardar el nuevo access token
        this.cookieService.setCookie('spotify_access_token', response.access_token, expireDate);

        // Si viene un nuevo refresh token, guardarlo
        if (response.refresh_token) {
          this.cookieService.setCookie('spotify_refresh_token', response.refresh_token, expireDate);
        }

        this.isRefreshing = false;
        this.refreshTokenSubject.next(response.access_token);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error refrescando token:', error);
        this.isRefreshing = false;
        this.signOut();
        return throwError(() => error);
      })
    );
  }

  public signOut(): void {
    this.cookieService.deleteCookie('spotify_access_token');
    this.cookieService.deleteCookie('spotify_refresh_token');
  }
  public isAuthenticated(): boolean {
    return this.cookieService.isCookieValid('spotify_access_token');
  }
}