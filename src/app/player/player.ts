import { Component, OnInit } from '@angular/core';
import { SpotifyAlbumService } from '../services/general/spotify-album-service';
import { Observable } from 'rxjs';
import { Album } from '../interfaces/album';

@Component({
  selector: 'app-player',
  templateUrl: './player.html',
  standalone: false,
  styleUrl: './player.css'
})
export class Player implements OnInit {


  album: Album | undefined;
  randomAlbums: Album[] = [];

  constructor(private _spotifyAlbum: SpotifyAlbumService) {
  }

  ngOnInit(): void {
    this.loadRandomAlbums();  // 12 álbumes random
  }


  loadRandomAlbums(): void {
    this._spotifyAlbum.getRandomAlbums(12).subscribe({
      next: (albums) => {
        this.randomAlbums = albums;
        console.log('✅ 12 álbumes aleatorios cargados:', albums);
      },
      error: (err) => console.error('❌ Error álbumes:', err)
    });
  }
}