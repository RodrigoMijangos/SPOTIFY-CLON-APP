import { Component, ViewChild, signal, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Track } from '../interfaces/track';
import { PlayerService } from '../services/general/player-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-audio-controller',
  standalone: false,
  templateUrl: './audio-controller.html',
  styleUrl: './audio-controller.css'
})
export class AudioController implements OnInit, OnDestroy {
  @ViewChild('audio') audioElement!: ElementRef<HTMLAudioElement>;
  @Input() playlist: Track[] = [];

  // Estados locales con signals
  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);
  progress = signal(0);
  currentIndex = 0;

  // Track actual viene del PlayerService
  currentTrack?: Track;
  
  // Subscripciones
  private subscriptions: Subscription[] = [];

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    // Suscribirse al track actual del servicio
    const trackSub = this.playerService.currentTrack$.subscribe(track => {
      if (track && track.id !== this.currentTrack?.id) {
        this.currentTrack = track;
        this.loadTrack(track);
      }
    });

    // Suscribirse al estado de reproducción
    const playingSub = this.playerService.isPlaying$.subscribe(playing => {
      this.isPlaying.set(playing);
    });

    this.subscriptions.push(trackSub, playingSub);
  }

  ngAfterViewInit() {
    const audio = this.audioElement.nativeElement;
    
    audio.addEventListener('timeupdate', () => {
      this.currentTime.set(audio.currentTime);
      this.progress.set((audio.currentTime / audio.duration) * 100 || 0);
      this.playerService.setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      this.duration.set(audio.duration);
    });

    audio.addEventListener('ended', () => {
      this.playNext();
    });

    // Si ya hay un track al iniciar, cargarlo
    if (this.currentTrack) {
      this.loadTrack(this.currentTrack);
    }
  }

  ngOnDestroy(): void {
    // Limpiar subscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  togglePlay() {
    const audio = this.audioElement.nativeElement;
    
    if (this.isPlaying()) {
      audio.pause();
      this.playerService.setIsPlaying(false);
    } else {
      audio.play().catch(error => {
        console.error('Error al reproducir:', error);
      });
      this.playerService.setIsPlaying(true);
    }
  }

  playPrevious() {
    if (this.playlist.length === 0) return;

    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.playlist.length - 1;
    }
    
    const track = this.playlist[this.currentIndex];
    this.playerService.setCurrentTrack(track);
  }

  playNext() {
    if (this.playlist.length === 0) return;

    if (this.currentIndex < this.playlist.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    
    const track = this.playlist[this.currentIndex];
    this.playerService.setCurrentTrack(track);
  }

  loadTrack(track: Track) {
    const audio = this.audioElement.nativeElement;
    this.currentTrack = track;
    
    // Spotify solo provee preview_url (30 segundos)
    const audioUrl = (track as any).preview_url || track.href;
    
    if (audioUrl) {
      audio.src = audioUrl;
      
      if (this.isPlaying()) {
        audio.play().catch(error => {
          console.error('Error al reproducir:', error);
          this.playerService.setIsPlaying(false);
        });
      }
    } else {
      console.warn('⚠️ No hay URL de audio disponible para:', track.name);
    }

    // Actualizar índice actual en la playlist
    const index = this.playlist.findIndex(t => t.id === track.id);
    if (index !== -1) {
      this.currentIndex = index;
    }
  }

  seekTo(event: Event) {
    const input = event.target as HTMLInputElement;
    const audio = this.audioElement.nativeElement;
    const seekTime = (Number(input.value) / 100) * audio.duration;
    audio.currentTime = seekTime;
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}