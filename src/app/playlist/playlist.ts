import { Component, input, effect, inject } from '@angular/core'; 
import { Track } from '../interfaces/track';
import { Image } from '../interfaces/image';
import { AudioService } from '../services/audio';

@Component({
  selector: 'app-playlist',
  standalone: false,
  templateUrl: './playlist.html',
  styleUrl: './playlist.css'
})

export class Playlist {

private audioService = inject(AudioService);

  playlist = input.required<Track[] | undefined>();
  cover = input.required<Image | undefined>();

  constructor() {
    effect(() => {
      const currentPlaylist = this.playlist();
      if (currentPlaylist) {
        this.audioService.setPlaylist(currentPlaylist);
      }
    });
  }
}