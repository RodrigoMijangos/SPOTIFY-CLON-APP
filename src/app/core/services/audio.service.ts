import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../models/track.model';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private audio = new Audio();
  private playlist: Track[] = [];
  private currentIndex = 0;
  
  public currentTrack$ = new BehaviorSubject<Track | null>(null);
  public isPlaying$ = new BehaviorSubject<boolean>(false);
  public currentTime$ = new BehaviorSubject<number>(0);
  public duration$ = new BehaviorSubject<number>(0);
  public volume$ = new BehaviorSubject<number>(0.8);
  
  get currentTrack() { return this.currentTrack$.asObservable(); }
  get isPlaying() { return this.isPlaying$.asObservable(); }
  get currentTime() { return this.currentTime$.asObservable(); }
  get duration() { return this.duration$.asObservable(); }
  get volume() { return this.volume$.asObservable(); }

  constructor() {
    this.audio.crossOrigin = 'anonymous';
    this.audio.volume = 0.8;
    
    this.audio.addEventListener('ended', () => this.next());
    this.audio.addEventListener('play', () => this.isPlaying$.next(true));
    this.audio.addEventListener('pause', () => this.isPlaying$.next(false));
    this.audio.addEventListener('timeupdate', () => this.currentTime$.next(this.audio.currentTime));
    this.audio.addEventListener('durationchange', () => this.duration$.next(this.audio.duration));
    this.audio.addEventListener('volumechange', () => this.volume$.next(this.audio.volume));
    
    this.audio.addEventListener('error', (e) => {
      console.warn('No se pudo cargar el audio:', e);
      this.generateTone();
    });
  }

  setPlaylist(tracks: Track[]): void {
    this.playlist = tracks;
    this.currentIndex = 0;
  }

  playTrack(track: Track): void {
    const index = this.playlist.findIndex(t => t.id === track.id);
    if (index !== -1) this.currentIndex = index;
    
    this.currentTrack$.next(track);
    console.log('Reproduciendo:', track.name);
    
    if (track.preview_url) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = track.preview_url;
      this.audio.load();
      this.audio.crossOrigin = 'anonymous';
      this.audio.preload = 'auto';
      
      this.audio.play()
        .then(() => {
          console.log('Música iniciada');
          this.isPlaying$.next(true);
        })
        .catch((error) => {
          console.warn('No se pudo reproducir el audio:', error);
          try {
            this.audio.src = track.preview_url!;
            this.audio.play();
          } catch (fallbackError) {
            console.warn('Reproduciendo tono de prueba');
            this.generateTone();
          }
        });
    } else {
      console.warn('Esta canción no tiene audio disponible');
      this.generateTone();
    }
  }

  private generateTone(): void {
    try {
      console.log('Reproduciendo sonido de prueba');
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 440;
      gain.gain.value = 0.1;
      
      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, context.currentTime + 1.5);
      
      oscillator.connect(gain);
      gain.connect(context.destination);
      
      oscillator.start();
      oscillator.stop(context.currentTime + 1.5);
      
      this.isPlaying$.next(true);
      setTimeout(() => this.isPlaying$.next(false), 1500);
    } catch (error) {
      console.error('Error:', error);
      this.isPlaying$.next(false);
    }
  }

  play(): void {
    if (this.audio.src) {
      this.audio.play().catch(console.error);
    }
  }

  pause(): void {
    this.audio.pause();
  }

  pauseTrack(): void {
    this.pause();
  }

  togglePlayPause(): void {
    if (this.isPlaying$.value) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  seek(time: number): void {
    if (this.audio.src && !isNaN(this.audio.duration)) {
      this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, time));
    }
  }

  next(): void {
    console.log('Siguiente canción');
    if (this.currentIndex < this.playlist.length - 1) {
      this.currentIndex++;
      this.playTrack(this.playlist[this.currentIndex]);
    } else {
      this.currentIndex = 0;
      this.playTrack(this.playlist[this.currentIndex]);
    }
  }

  previous(): void {
    console.log('Canción anterior');
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.playTrack(this.playlist[this.currentIndex]);
    } else {
      this.currentIndex = this.playlist.length - 1;
      this.playTrack(this.playlist[this.currentIndex]);
    }
  }

  getCurrentTrackInfo(): Track | null {
    return this.playlist[this.currentIndex] || null;
  }

  getPlaylistInfo(): { current: number; total: number } {
    return { current: this.currentIndex + 1, total: this.playlist.length };
  }
}