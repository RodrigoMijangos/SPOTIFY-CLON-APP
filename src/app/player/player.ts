import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyAlbumService } from '../services/spotify-api/spotify-album-service';
import { Album } from '../interfaces/album';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit {

  album$!: Observable<Album>

  constructor(
    private _spotifyAlbum: SpotifyAlbumService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const albumId = params['id'] || '4aawyAB9vmqN3uQ7FjRGTy'; // Default ID if none provided
      this.album$ = this._spotifyAlbum.getAlbum(albumId);
    });
  }

}
