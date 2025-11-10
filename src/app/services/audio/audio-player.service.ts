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
    console.log('🎵 Reproduciendo:', track.name, 'por', track.artists?.[0]?.name);
    
    if (track.preview_url) {
      console.log('🔄 Intentando preview de Spotify:', track.preview_url);
      
      // Crear nuevo audio element para evitar problemas
      this.audio = new Audio();
      this.setupAudioEvents();
      
      this.audio.src = track.preview_url;
      this.audio.crossOrigin = 'anonymous';
      this.audio.volume = this.volumeSubject.value;
      
      // Intentar cargar y reproducir
      const playPromise = this.audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ Reproduciendo audio real de Spotify!');
            this.isPlayingSubject.next(true);
          })
          .catch((error) => {
            console.log('❌ Preview no disponible:', error.message);
            this.generarAudioMusical(track);
          });
      } else {
        this.generarAudioMusical(track);
      }
    } else {
      console.log('ℹ️ Esta canción no tiene preview - generando audio musical');
      this.generarAudioMusical(track);
    }
  }

  private generarAudioMusical(track: Track): void {
    console.log('🎼 Generando audio musical para:', track.name);
    
    this.detenerAudioGenerado(); // Limpiar audio anterior
    
    try {
      // Crear contexto de audio
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Obtener tonalidad basada en el nombre de la canción
      const tono = this.obtenerTonoDeCancion(track.name);
      
      // Crear oscilador para melodía principal
      this.oscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();
      
      // Conectar nodos
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      
      // Configurar oscilador
      this.oscillator.type = 'sine'; // Sonido suave
      this.oscillator.frequency.setValueAtTime(tono, this.audioContext.currentTime);
      
      // Configurar volumen
      this.gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      
      // Crear melodía variada
      this.crearMelodia(tono);
      
      // Iniciar reproducción
      this.oscillator.start();
      
      // Configurar duración y progreso
      this.isPlayingSubject.next(true);
      this.durationSubject.next(30);
      this.currentTimeSubject.next(0);
      
      // Actualizar progreso
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
    // Convertir nombre a número para obtener tonalidad consistente
    const hash = nombreCancion.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Tonos musicales agradables (escala pentatónica en Hz)
    const tonos = [261.63, 293.66, 329.63, 392.00, 440.00, 493.88, 523.25]; // C4 a C5
    return tonos[hash % tonos.length];
  }

  private crearMelodia(tonoBase: number): void {
    if (!this.audioContext || !this.oscillator || !this.gainNode) return;
    
    const duracion = 30; // 30 segundos
    const cambiosDeTono = 8; // Cambios de tono durante la canción
    
    for (let i = 0; i < cambiosDeTono; i++) {
      const tiempo = (duracion / cambiosDeTono) * i;
      const variacion = (Math.sin(i * 0.5) * 100); // Variación melódica
      const nuevoTono = tonoBase + variacion;
      
      this.oscillator.frequency.setValueAtTime(
        nuevoTono, 
        this.audioContext.currentTime + tiempo
      );
      
      // Variaciones de volumen para ritmo
      const volumen = 0.05 + (Math.sin(i * 0.8) * 0.03);
      this.gainNode.gain.setValueAtTime(
        volumen, 
        this.audioContext.currentTime + tiempo
      );
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

  private generarTonoSimulacion(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.oscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();
      
      // Configurar onda más suave (sine wave en lugar de square wave)
      this.oscillator.type = 'sine';
      
      // Melody simple que cambia cada 3 segundos
      const notas = [261.63, 293.66, 329.63, 349.23]; // Do, Re, Mi, Fa
      let notaActual = 0;
      
      this.oscillator.frequency.setValueAtTime(notas[0], this.audioContext.currentTime);
      
      // Cambiar notas cada 3 segundos
      const cambiarNota = () => {
        if (this.oscillator && this.audioContext) {
          notaActual = (notaActual + 1) % notas.length;
          this.oscillator.frequency.setValueAtTime(
            notas[notaActual], 
            this.audioContext.currentTime
          );
        }
      };
      
      // Programar cambios de notas
      for (let i = 1; i < 10; i++) {
        setTimeout(cambiarNota, i * 3000);
      }
      
      // Volumen muy bajo y suave
      this.gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
      
      // Conectar nodos
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      
      // Iniciar con fade in suave
      this.gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 1);
      this.oscillator.start();
      
      console.log('Audio de simulacion iniciado (melodia suave)');
    } catch (error) {
      console.log('No se puede generar audio de muestra');
    }
  }

  private detenerTonoSimulacion(): void {
    try {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator = null;
      }
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }
    } catch (error) {
      console.log('Error deteniendo tono');
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
      this.audio.play().catch((error) => {
        console.log('Error con audio HTML5, usando audio generado');
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
    
    // Limpiar interval si existe
    if ((this as any).currentInterval) {
      clearInterval((this as any).currentInterval);
      (this as any).currentInterval = null;
    }
  }

  next(): void {
    if (!this.playlist.length) return;
    this.detenerAudioGenerado(); // Limpiar audio actual
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    this.loadAndPlay(this.playlist[this.currentTrackIndex]);
  }

  previous(): void {
    if (!this.playlist.length) return;
    this.detenerAudioGenerado(); // Limpiar audio actual
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
