import { Component, OnInit, signal } from '@angular/core';
import { SpotifyLoginService } from './services/spotify-api/spotify-login-service';
import { SpotifyAlbumService } from './services/spotify-api/spotify-album-service';
import { CookiesStorageService } from './services/general/cookies-storage-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit{

  constructor(
    private _spotifyLogin: SpotifyLoginService,
    private _cookieStorage: CookiesStorageService
  ){}

  ngOnInit(): void {
    // Limpiar token viejo siempre
    this._cookieStorage.deleteKeyValue('access_token');
    console.log('🧹 Token anterior limpiado');
    
    // Obtener nuevo token con TUS credenciales reales
    this._spotifyLogin.getAccessToken().subscribe({
      next: (response) => {
        console.log('✅ Token obtenido con tus credenciales:', response);
        console.log('🎵 Ahora puedes buscar música!');
      },
      error: (error) => {
        console.error('❌ Error obteniendo token:', error);
        console.log('🔍 Verifica que las credenciales estén correctas en environment.development.ts');
      }
    });
  }

}
