import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AudioPlayerService } from '../services/audio/audio-player.service';
import { Track } from '../interfaces/track';

@Component({
  selector: 'app-audio-controller',
  standalone: false,
  templateUrl: './audio-controller.html',
  styleUrl: './audio-controller.css'
})
export class AudioController implements OnInit, OnDestroy {
  currentTrack: Track | null = null;
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 0.7;
  
  private subscriptions: Subscription[] = [];

  constructor(private audioPlayerService: AudioPlayerService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.audioPlayerService.currentTrack$.subscribe(track => this.currentTrack = track),
      this.audioPlayerService.isPlaying$.subscribe(playing => this.isPlaying = playing),
      this.audioPlayerService.currentTime$.subscribe(time => this.currentTime = time),
      this.audioPlayerService.duration$.subscribe(duration => this.duration = duration),
      this.audioPlayerService.volume$.subscribe(volume => this.volume = volume)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  togglePlayPause(): void { this.audioPlayerService.togglePlayPause(); }
  previousTrack(): void { this.audioPlayerService.previous(); }
  nextTrack(): void { this.audioPlayerService.next(); }
  onSeek(event: Event): void { this.audioPlayerService.seekTo(parseFloat((event.target as HTMLInputElement).value)); }
  onVolumeChange(event: Event): void { this.audioPlayerService.setVolume(parseFloat((event.target as HTMLInputElement).value)); }
  formatTime(seconds: number): string { return this.audioPlayerService.formatTime(seconds); }
  getProgress(): number { return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0; }
  getArtistNames(): string { return this.currentTrack?.artists?.map(artist => artist.name).join(', ') || 'Artista desconocido'; }
  getAlbumImage(): string { return this.currentTrack?.album?.images?.[0]?.url || 'assets/default-album.svg'; }
}
