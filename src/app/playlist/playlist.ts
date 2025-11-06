import { Component, input } from '@angular/core';
import { Song } from '../interfaces/song';
import { Track } from '../interfaces/track';
import { Image } from '../interfaces/image';
import { AudioPlayerService } from '../services/audio/audio-player.service';

@Component({
  selector: 'app-playlist',
  standalone: false,
  templateUrl: './playlist.html',
  styleUrl: './playlist.css'
})
export class Playlist {

  playlist = input.required<Track[] | undefined>();
  cover = input.required<Image | undefined>();

  constructor(private _audioPlayer: AudioPlayerService) {}

  playTrack(track: Track): void {
    const currentPlaylist = this.playlist();
    if (currentPlaylist) {
      this._audioPlayer.setPlaylist(currentPlaylist);
      this._audioPlayer.playTrack(track);
    }
  }

  formatDuration(duration: number): string {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  isCurrentTrack(track: Track): boolean {
    // Implementaremos esto cuando tengamos acceso al track actual
    return false;
  }
}
