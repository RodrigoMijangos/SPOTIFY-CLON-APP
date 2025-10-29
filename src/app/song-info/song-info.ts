import { Component, input, HostListener, inject } from '@angular/core';
import { Track } from '../interfaces/track';
import { Image } from '../interfaces/image';
import { AudioService } from '../services/audio';

@Component({
  selector: 'app-song-info',
  standalone: false,
  templateUrl: './song-info.html',
  styleUrl: './song-info.css',
  host:{
    '[class]': 'displayMode()',
  }
})

export class SongInfo{
  display_mode = input.required<string>({ alias: 'displayMode'});
  song = input.required<Track | undefined>();
  cover = input.required<Image | undefined>();

  private audioService = inject(AudioService);

  displayMode(){
    return this.display_mode();
  }

  @HostListener('click')
  onClick() {
    if (this.displayMode() === 'card' && this.song()) {
      this.audioService.playSong(this.song()!);
    }
  }
} 
