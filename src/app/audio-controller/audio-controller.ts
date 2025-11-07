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
    // Suscribirse a los observables del servicio de audio
    this.subscriptions.push(
      this.audioPlayerService.currentTrack$.subscribe(track => {
        this.currentTrack = track;
      }),
      
      this.audioPlayerService.isPlaying$.subscribe(playing => {
        this.isPlaying = playing;
      }),
      
      this.audioPlayerService.currentTime$.subscribe(time => {
        this.currentTime = time;
      }),
      
      this.audioPlayerService.duration$.subscribe(duration => {
        this.duration = duration;
      }),
      
      this.audioPlayerService.volume$.subscribe(volume => {
        this.volume = volume;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Controles de reproducción
  togglePlayPause(): void {
    this.audioPlayerService.togglePlayPause();
  }

  previousTrack(): void {
    this.audioPlayerService.previous();
  }

  nextTrack(): void {
    this.audioPlayerService.next();
  }

  // Control de tiempo
  onSeek(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newTime = parseFloat(target.value);
    this.audioPlayerService.seekTo(newTime);
  }

  // Control de volumen
  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newVolume = parseFloat(target.value);
    this.audioPlayerService.setVolumen(newVolume);
  }

  // Formatear tiempo
  formatTime(seconds: number): string {
    return this.audioPlayerService.formatTime(seconds);
  }

  // Obtener progreso como porcentaje
  getProgress(): number {
    return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
  }

  // Obtener nombres de artistas
  getArtistNames(): string {
    if (!this.currentTrack?.artists) return 'Artista desconocido';
    return this.currentTrack.artists.map(artist => artist.name).join(', ');
  }

  // Obtener imagen del álbum
  getAlbumImage(): string {
    const defaultImage = 'assets/default-album.png';
    if (!this.currentTrack?.album?.images || this.currentTrack.album.images.length === 0) {
      return defaultImage;
    }
    return this.currentTrack.album.images[0].url || defaultImage;
  }
}
