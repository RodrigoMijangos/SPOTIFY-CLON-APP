import { Component, OnInit } from '@angular/core';
import { SpotifyAlbumService } from '../services/general/spotify-album-service';
import { Album } from '../interfaces/album';
import { Observable, of } from 'rxjs';
import { CookiesStorageService } from '../services/cookie-storage-service';
import { PlaylistService } from '../services/spotify-api/playlist-service';

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
    private _cookieService: CookiesStorageService,
    private playlistService: PlaylistService,
    private albumService: SpotifyAlbumService
  ) { }


  ngOnInit(): void {

    this.token = localStorage.getItem('spotify_token') || '';
    
    this.loadFeaturedPlaylist();
    this.loadHighlightAlbum();
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


  featuredPlaylist?: Album;  // "The best of..." principal
  recommendedAlbums: Album[] = [];  // 3 álbumes pequeños
  highlightAlbum?: Album;  // Álbum grande del lado derecho
  token: string = "";


  loadFeaturedPlaylist(): void {
    this.playlistService.getPlaylist(this.token).subscribe({
      next: (playlist) => {
        this.featuredPlaylist = playlist;
      }
    });
  }

  loadHighlightAlbum(): void {
    this.albumService.getAlbum(this.token).subscribe({
      next: (album) => {
        this.highlightAlbum = album;
      }
    });
  }

  // Método para reproducir un álbum/playlist
  playAlbum(tracks: any[]): void {
    // Enviar al audio-controller
  }
}