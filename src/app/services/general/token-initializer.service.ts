import { Injectable, OnInit } from '@angular/core';
import { SpotifyLoginService } from '../spotify-api/spotify-login-service';
import { CookiesStorageService } from './cookies-storage-service';

@Injectable({
  providedIn: 'root'
})
export class TokenInitializerService {
  
  constructor(
    private spotifyLogin: SpotifyLoginService,
    private cookieService: CookiesStorageService
  ) {
    this.initializeToken();
  }

  private initializeToken(): void {
    // Verificar si ya existe un token válido
    const existingToken = this.cookieService.getKeyValue('access_token');
    
    if (!existingToken || existingToken === '') {
      // Si no hay token o está vacío, obtener uno nuevo
      this.getNewToken();
    }
  }

  private getNewToken(): void {
    this.spotifyLogin.getAccessToken().subscribe({
      next: (response) => {
        console.log('Token obtenido exitosamente');
        // El token se guarda automáticamente gracias al interceptor
      },
      error: (error) => {
        console.error('Error al obtener token:', error);
        // Reintentar después de 5 segundos
        setTimeout(() => this.getNewToken(), 5000);
      }
    });
  }

  // Método público para refrescar el token manualmente
  refreshToken(): void {
    this.getNewToken();
  }

  isTokenValid(): boolean {
    const token = this.cookieService.getKeyValue('access_token');
    return Boolean(token && token !== '');
  }
}