import { Component, OnInit } from '@angular/core';
import { SpotifyLoginService } from '../services/general/spotify-login-service';
import { SpotifyAlbumService } from '../services/general/spotify-album-service';
import { PlayerService } from '../services/general/player-service';
import { CookiesStorageService } from '../services/cookie-storage-service';
import { Album } from '../interfaces/album';
import { Track } from '../interfaces/track';

@Component({
  selector: 'app-player',
  standalone : false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit {
  randomAlbums: Album[] = [];  
  featuredAlbum?: Album;  
  playlist: Track[] = [];  
  currentTrack?: Track;

  constructor(
    private loginService: SpotifyLoginService,
    private albumService: SpotifyAlbumService,
    private playerService: PlayerService,
    private cookieService: CookiesStorageService
  ) {}

  ngOnInit(): void {
    const token = this.cookieService.getCookie('spotify_access_token');
    
    if (token) {
      console.log('Token ya existe en cookies');
      this.loadData();
    } else {
      console.log('No hay token, obteniendo nuevo...');
      this.getToken();
    }

    this.playerService.currentTrack$.subscribe(track => {
      if (track) {
        this.currentTrack = track;
      }
    });
  }

  getToken(): void {
    this.loginService.getAccessToken().subscribe({
      next: (response) => {
        console.log('✅ Token obtenido:', response.access_token);
        setTimeout(() => {
          this.loadData();
        }, 100);
      },
      error: (error) => {
        console.error('❌ Error obteniendo token:', error);
      }
    });
  }

  loadData(): void {
    this.loadRandomAlbums();
    this.loadFeaturedAlbum();
  }

  loadRandomAlbums(): void {
    const albumIds = [
      '6DEjYFkNZh67HP7R9PSZvv',
      '2ODvWsOgouMbaA5xf0RkJe',
      '3RNrq3jvMZxD9ZyoOZbQOD',
      '1ATL5GLyefJaxhQzSPVrLX'
    ];

    this.randomAlbums = [];

    albumIds.forEach((id, index) => {
      this.albumService.getAlbum(id).subscribe({
        next: (album) => {
          console.log(`Álbum ${index + 1} cargado:`, album.name);
          this.randomAlbums.push(album);
        },
        error: (error) => {
          console.error(`❌ Error cargando álbum ${id}:`, error);
        }
      });
    });
  }

  loadFeaturedAlbum(): void {
    // Álbum destacado del lado derecho
    const featuredAlbumId = '1ATL5GLyefJaxhQzSPVrLX';
    
    this.albumService.getAlbum(featuredAlbumId).subscribe({
      next: (album) => {
        console.log('✅ Álbum destacado cargado:', album);
        this.featuredAlbum = album;
        
        // Establecer playlist del álbum
        if (album.tracks && album.tracks.length > 0) {
          this.playlist = album.tracks;
          
          // Establecer primera canción como actual usando PlayerService
          this.playerService.setCurrentTrack(album.tracks[0]);
        }
      },
      error: (error) => {
        console.error('❌ Error cargando álbum destacado:', error);
      }
    });
  }

  // Método cuando se hace clic en un álbum del grid
  onAlbumClick(album: Album): void {
    console.log('🎵 Álbum seleccionado:', album.name);
    this.featuredAlbum = album;
    
    // Actualizar playlist con las canciones del álbum
    if (album.tracks && album.tracks.length > 0) {
      this.playlist = album.tracks;
      
      // Establecer primera canción como actual
      this.playerService.setCurrentTrack(album.tracks[0]);
    }
  }
}