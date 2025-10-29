import { Component, OnInit } from '@angular/core';
import { SpotifyLoginService } from '../services/general/spotify-login-service';
import { SpotifyAlbumService } from '../services/general/spotify-album-service';
import { PlayerService } from '../services/general/player-service';
import { CookiesStorageService } from '../services/cookie-storage-service';
import { Album } from '../interfaces/album';
import { Track } from '../interfaces/track';

@Component({
  selector: 'app-player',
  templateUrl: './player.html',
  styleUrls: ['./player.css']
})
export class Player implements OnInit {
  
  featuredAlbum?: Album;
  playlist: Track[] = [];

  constructor(
    private loginService: SpotifyLoginService,
    private albumService: SpotifyAlbumService,
    private playerService: PlayerService,
    private cookieService: CookiesStorageService
  ) {}

  ngOnInit(): void {
    const token = this.cookieService.getCookie('spotify_access_token');
    
    if (token) {
      console.log('✅ Token desde cookies');
      this.loadFeaturedAlbum();
    } else {
      console.log('❌ Sin token, obteniendo...');
      this.getToken();
    }
  }

  getToken(): void {
    this.loginService.getAccessToken().subscribe({
      next: (response) => {
        console.log('✅ Token obtenido:', response.access_token);
        setTimeout(() => this.loadFeaturedAlbum(), 100);
      },
      error: (error) => console.error('❌ Error token:', error)
    });
  }

  loadFeaturedAlbum(): void {
    // Usa TU servicio de Spotify
    this.albumService.getAlbum('1ATL5GLyefJaxhQzSPVrLX').subscribe({
      next: (album) => {
        console.log('✅ Álbum destacado:', album);
        this.featuredAlbum = album;
        
        if (album.tracks && album.tracks.length > 0) {
          this.playlist = album.tracks;
          this.playerService.setCurrentTrack(album.tracks[0]);
        }
      },
      error: (error) => console.error('❌ Error álbum:', error)
    });
  }
}