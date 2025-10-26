import { Component, OnInit } from '@angular/core';
import { SpotifyAlbumService } from '../services/general/spotify-album-service';
import { Album } from '../interfaces/album';
import { Observable, of } from 'rxjs';
import { CookiesStorageService } from '../services/cookie-storage-service';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit {

  album$: Observable<Album> = of();

  constructor(
    private _spotifyAlbum: SpotifyAlbumService,
    private _cookieService: CookiesStorageService
  ) { }

  ngOnInit(): void {
    // Espera un poco a que app.ts obtenga el token
    setTimeout(() => {
      const token = this._cookieService.getCookie('spotify_access_token');
      
      if (token) {
        console.log('✅ Token encontrado en Player, obteniendo álbum...');
        this.album$ = this._spotifyAlbum.getAlbum('4aawyAB9vmqN3uQ7FjRGTy');
      } else {
        console.error('❌ No hay token disponible');
      }
    }, 1000);
  }
}