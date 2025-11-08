import { Component } from '@angular/core';
import { Album } from '../interfaces/album';

@Component({
  selector: 'app-views',
  standalone: false,
  templateUrl: './views.html',
  styleUrl: './views.css'
})
export class Views {
  
   album: Album | undefined;
  currentSong: Track | undefined;
  currentCover: Image | undefined;
  playlist: Track[] = [];

  constructor(
    private sharedData: SharedDataService,
    private spotifyService: SpotifyAlbumService
  ) {}

}
