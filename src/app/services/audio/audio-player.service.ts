import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Track } from '../../interfaces/track';

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
  private audio = new Audio();
  private playlist: Track[] = [];
  private currentTrackIndex = 0;
  
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private currentTimeSubject = new BehaviorSubject<number>(0);
  private durationSubject = new BehaviorSubject<number>(0);
  private volumeSubject = new BehaviorSubject<number>(0.7);
  
  currentTrack$ = this.currentTrackSubject.asObservable();
  isPlaying$ = this.isPlayingSubject.asObservable();
  currentTime$ = this.currentTimeSubject.asObservable();
  duration$ = this.durationSubject.asObservable();
  volume$ = this.volumeSubject.asObservable();

  constructor() { this.setupAudioEvents(); }

  private setupAudioEvents(): void {
    this.audio.addEventListener('loadedmetadata', () => this.durationSubject.next(this.audio.duration));
    this.audio.addEventListener('timeupdate', () => this.currentTimeSubject.next(this.audio.currentTime));
    this.audio.addEventListener('ended', () => this.next());
    this.audio.addEventListener('play', () => this.isPlayingSubject.next(true));
    this.audio.addEventListener('pause', () => this.isPlayingSubject.next(false));
    this.audio.addEventListener('error', () => this.isPlayingSubject.next(false));
  }

  setPlaylist(tracks: Track[]): void { this.playlist = tracks; this.currentTrackIndex = 0; }

  playTrack(track: Track): void {
    const trackIndex = this.playlist.findIndex(t => t.id === track.id);
    this.currentTrackIndex = trackIndex !== -1 ? trackIndex : (this.playlist = [track], 0);
    this.loadAndPlay(track);
  }

  private loadAndPlay(track: Track): void {
    this.currentTrackSubject.next(track);
    this.pause();
    
    if (track.preview_url) {
      this.audio.src = track.preview_url;
      this.audio.crossOrigin = 'anonymous';
      this.audio.load();
      this.audio.play().catch(() => this.generarAudioMusical(track));
    } else {
      this.generarAudioMusical(track);
    }
  }

  private generarAudioMusical(track: Track): void {
    this.detenerAudioGenerado();
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const tono = this.obtenerTonoDeCancion(track.name);
      this.oscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();
      
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      this.oscillator.type = 'sine';
      this.oscillator.frequency.setValueAtTime(tono, this.audioContext.currentTime);
      this.gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      this.crearMelodia(tono);
      this.oscillator.start();
      
      this.isPlayingSubject.next(true);
      this.durationSubject.next(30);
      this.currentTimeSubject.next(0);
      
      const interval = setInterval(() => {
        const currentTime = this.currentTimeSubject.value + 1;
        this.currentTimeSubject.next(currentTime);
        
        if (currentTime >= 30) {
          clearInterval(interval);
          this.detenerAudioGenerado();
          this.isPlayingSubject.next(false);
          setTimeout(() => this.next(), 1000);
        }
      }, 1000);
      
      (this as any).currentInterval = interval;
      
    } catch (error) {
      console.error('Error creando audio:', error);
      this.isPlayingSubject.next(false);
    }
  }

  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  private obtenerTonoDeCancion(nombreCancion: string): number {
    const hash = nombreCancion.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const tonos = [261.63, 293.66, 329.63, 392.00, 440.00, 493.88, 523.25];
    return tonos[hash % tonos.length];
  }

  private crearMelodia(tonoBase: number): void {
    if (!this.audioContext || !this.oscillator || !this.gainNode) return;
    
    const duracion = 30;
    const cambiosDeTono = 8;
    
    for (let i = 0; i < cambiosDeTono; i++) {
      const tiempo = (duracion / cambiosDeTono) * i;
      const variacion = (Math.sin(i * 0.5) * 100);
      const nuevoTono = tonoBase + variacion;
      
      this.oscillator.frequency.setValueAtTime(nuevoTono, this.audioContext.currentTime + tiempo);
      const volumen = 0.05 + (Math.sin(i * 0.8) * 0.03);
      this.gainNode.gain.setValueAtTime(volumen, this.audioContext.currentTime + tiempo);
    }
  }

  private detenerAudioGenerado(): void {
    try {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }
      if ((this as any).currentInterval) {
        clearInterval((this as any).currentInterval);
      }
    } catch (error) {
      console.log('Error limpiando audio:', error);
    }
  }



  togglePlayPause(): void { 
    if (this.isPlayingSubject.value) {
      this.pause();
    } else {
      this.play();
    }
  }

  play(): void { 
    if (this.audio.src) {
      this.audio.play().catch(() => {
        const currentTrack = this.currentTrackSubject.value;
        if (currentTrack) {
          this.generarAudioMusical(currentTrack);
        }
      });
    } else {
      const currentTrack = this.currentTrackSubject.value;
      if (currentTrack) {
        this.generarAudioMusical(currentTrack);
      }
    }
  }

  pause(): void { 
    this.audio.pause();
    this.isPlayingSubject.next(false);
    this.detenerAudioGenerado();
    
    if ((this as any).currentInterval) {
      clearInterval((this as any).currentInterval);
      (this as any).currentInterval = null;
    }
  }

  next(): void {
    if (!this.playlist.length) return;
    this.detenerAudioGenerado();
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    this.loadAndPlay(this.playlist[this.currentTrackIndex]);
  }

  previous(): void {
    if (!this.playlist.length) return;
    this.detenerAudioGenerado();
    this.currentTrackIndex = this.currentTrackIndex === 0 ? this.playlist.length - 1 : this.currentTrackIndex - 1;
    this.loadAndPlay(this.playlist[this.currentTrackIndex]);
  }

  seekTo(time: number): void { this.audio.currentTime = time; }
  setVolume(volume: number): void { this.audio.volume = Math.max(0, Math.min(1, volume)); this.volumeSubject.next(this.audio.volume); }
  getVolume(): number { return this.audio.volume; }
  getCurrentTrack(): Track | null { return this.currentTrackSubject.value; }
  isPlaying(): boolean { return this.isPlayingSubject.value; }
  getCurrentTime(): number { return this.audio.currentTime; }
  getDuration(): number { return this.audio.duration || 0; }
  formatTime(segundos: number): string {
    if (isNaN(segundos)) return '0:00';
    const minutos = Math.floor(segundos / 60), segs = Math.floor(segundos % 60);
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  }
}
