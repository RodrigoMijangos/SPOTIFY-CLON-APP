import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Track } from '../../interfaces/track';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private audio = new Audio();
  private playlist: Track[] = [];
  private currentTrackIndex = 0;
  
  // Estado del reproductor
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private currentTimeSubject = new BehaviorSubject<number>(0);
  private durationSubject = new BehaviorSubject<number>(0);
  private volumeSubject = new BehaviorSubject<number>(0.7);
  
  // Observables públicos
  currentTrack$ = this.currentTrackSubject.asObservable();
  isPlaying$ = this.isPlayingSubject.asObservable();
  currentTime$ = this.currentTimeSubject.asObservable();
  duration$ = this.durationSubject.asObservable();
  volume$ = this.volumeSubject.asObservable();

  constructor() {
    this.setupAudioEvents();
  }

  private setupAudioEvents(): void {
    // Cuando se carga la metadata del audio
    this.audio.addEventListener('loadedmetadata', () => {
      this.durationSubject.next(this.audio.duration);
    });

    // Actualización del tiempo actual
    this.audio.addEventListener('timeupdate', () => {
      this.currentTimeSubject.next(this.audio.currentTime);
    });

    // Cuando termina una canción
    this.audio.addEventListener('ended', () => {
      this.next();
    });

    // Cuando empieza a reproducir
    this.audio.addEventListener('play', () => {
      this.isPlayingSubject.next(true);
    });

    // Cuando se pausa
    this.audio.addEventListener('pause', () => {
      this.isPlayingSubject.next(false);
    });

    // Error de carga
    this.audio.addEventListener('error', (e) => {
      console.error('Error reproduciendo audio:', e);
      this.isPlayingSubject.next(false);
    });
  }

  // Establecer playlist
  setPlaylist(tracks: Track[]): void {
    this.playlist = tracks;
    this.currentTrackIndex = 0;
  }

  // Reproducir una canción específica
  playTrack(track: Track): void {
    // Buscar el índice de la canción en la playlist
    const trackIndex = this.playlist.findIndex(t => t.id === track.id);
    if (trackIndex !== -1) {
      this.currentTrackIndex = trackIndex;
    } else {
      // Si no está en la playlist, agregarla y reproducirla
      this.playlist = [track];
      this.currentTrackIndex = 0;
    }

    this.loadAndPlay(track);
  }

  private loadAndPlay(track: Track): void {
    if (!track.preview_url) {
      console.warn('No hay preview URL disponible para esta canción');
      return;
    }

    this.audio.src = track.preview_url;
    this.currentTrackSubject.next(track);
    
    this.audio.load();
    this.audio.play().catch(error => {
      console.error('Error al reproducir:', error);
    });
  }

  // Play/Pause
  togglePlayPause(): void {
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  play(): void {
    if (this.audio.src) {
      this.audio.play().catch(error => {
        console.error('Error al reproducir:', error);
      });
    }
  }

  pause(): void {
    this.audio.pause();
  }

  // Siguiente canción
  next(): void {
    if (this.playlist.length === 0) return;
    
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    const nextTrack = this.playlist[this.currentTrackIndex];
    this.loadAndPlay(nextTrack);
  }

  // Canción anterior
  previous(): void {
    if (this.playlist.length === 0) return;
    
    this.currentTrackIndex = this.currentTrackIndex === 0 
      ? this.playlist.length - 1 
      : this.currentTrackIndex - 1;
    const prevTrack = this.playlist[this.currentTrackIndex];
    this.loadAndPlay(prevTrack);
  }

  // Cambiar tiempo de reproducción
  seekTo(time: number): void {
    this.audio.currentTime = time;
  }

  // Cambiar volumen
  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
    this.volumeSubject.next(this.audio.volume);
  }

  // Obtener volumen actual
  getVolume(): number {
    return this.audio.volume;
  }

  // Obtener información actual
  getCurrentTrack(): Track | null {
    return this.currentTrackSubject.value;
  }

  isPlaying(): boolean {
    return this.isPlayingSubject.value;
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration || 0;
  }

  // Formatear tiempo
  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}
