import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SpotifyAlbumService } from '../services/spotify-api/spotify-album-service';
import { Track } from '../interfaces/track';
import { Subscription } from 'rxjs';
import { AudioPlayerService } from '../services/audio/audio-player.service';
import { Album } from '../interfaces/album';

@Component({
  selector: 'app-audio-controller',
  standalone: false,
  templateUrl: './audio-controller.html',
  styleUrl: './audio-controller.css'
})
export class AudioController implements OnInit, OnDestroy {

  @ViewChild('audio', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('controlBar', { static: true }) controlBarRef!: ElementRef<HTMLInputElement>;

  private albumSub!: Subscription;
  private currentTrackSub!: Subscription;
  private isPlayingSub!: Subscription;
  
  currentTrack: Track | null = null;
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 1;
  progress = 0;

  constructor(
    private _spotifyAlbum: SpotifyAlbumService,
    private _audioPlayer: AudioPlayerService
  ){
  }

  ngOnInit(): void {
    // Suscribirse a los observables del servicio
    this.currentTrackSub = this._audioPlayer.currentTrack$.subscribe(track => {
      this.currentTrack = track;
      if (track && track.preview_url) {
        this.loadTrack(track);
      }
    });

    this.isPlayingSub = this._audioPlayer.isPlaying$.subscribe(playing => {
      this.isPlaying = playing;
      if (playing) {
        this.playAudio();
      } else {
        this.pauseAudio();
      }
    });

    // Cargar álbum inicial y configurar playlist
    this.albumSub = this._spotifyAlbum.getAlbum('4aawyAB9vmqN3uQ7FjRGTy').subscribe((album: Album) => {
      if (album.tracks) {
        this._audioPlayer.setPlaylist(album.tracks);
        // Reproducir la primera canción si hay tracks
        if (album.tracks.length > 0) {
          this._audioPlayer.playTrack(album.tracks[0]);
        }
      }
    });

    // Configurar eventos del audio
    const audio = this.audioRef.nativeElement;
    audio.addEventListener('timeupdate', () => this.onTimeUpdate());
    audio.addEventListener('ended', () => this.onTrackEnded());
    audio.addEventListener('loadedmetadata', () => this.onMetadataLoaded());
    audio.volume = this.volume;
  }

  ngOnDestroy(): void {
    this.albumSub?.unsubscribe();
    this.currentTrackSub?.unsubscribe();
    this.isPlayingSub?.unsubscribe();
  }

  private loadTrack(track: Track): void {
    const audio = this.audioRef.nativeElement;
    if (!track.preview_url) {
      audio.src = '';
      return;
    }

    audio.src = track.preview_url;
    audio.load();
  }

  private playAudio(): void {
    const audio = this.audioRef.nativeElement;
    if (audio.src) {
      audio.play().catch(error => console.error('Error playing audio:', error));
    }
  }

  private pauseAudio(): void {
    const audio = this.audioRef.nativeElement;
    audio.pause();
  }

  togglePlay(): void {
    this._audioPlayer.togglePlay();
  }

  next(): void {
    this._audioPlayer.next();
  }

  prev(): void {
    this._audioPlayer.prev();
  }

  onSeek(event: any): void {
    const audio = this.audioRef.nativeElement;
    const value = parseFloat(event.target.value);
    audio.currentTime = value;
  }

  onVolumeChange(event: any): void {
    const audio = this.audioRef.nativeElement;
    this.volume = parseFloat(event.target.value);
    audio.volume = this.volume;
  }

  private onTimeUpdate(): void {
    const audio = this.audioRef.nativeElement;
    const control = this.controlBarRef.nativeElement;
    
    if (audio.duration && !isNaN(audio.duration)) {
      this.currentTime = audio.currentTime;
      this.duration = audio.duration;
      this.progress = (audio.currentTime / audio.duration) * 100;
      
      control.max = String(Math.floor(audio.duration));
      control.value = String(Math.floor(audio.currentTime));
    }
  }

  private onTrackEnded(): void {
    this._audioPlayer.next();
  }

  private onMetadataLoaded(): void {
    const audio = this.audioRef.nativeElement;
    this.duration = audio.duration;
  }

  // Formatear tiempo en minutos:segundos
  formatTime(time: number): string {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
