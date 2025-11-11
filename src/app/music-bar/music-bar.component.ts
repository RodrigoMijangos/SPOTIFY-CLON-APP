import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AudioService } from '../core/services/audio.service';
import { Track } from '../core/models/track.model';

@Component({
  selector: 'app-music-bar',
  standalone: false,
  template: `
    <div class="music-bar" *ngIf="currentTrack">
      <!-- Información de la canción -->
      <div class="track-info">
        <div class="track-image">
          <img [src]="currentTrack.album.images[2].url || 'assets/default-album.png'" 
               [alt]="currentTrack.name">
        </div>
        <div class="track-details">
          <div class="track-name">{{ currentTrack.name }}</div>
          <div class="track-artist">{{ getArtistNames(currentTrack.artists) }}</div>
        </div>
      </div>

      <!-- Controles de reproducción -->
      <div class="playback-controls">
        <div class="control-buttons">
          <button class="control-btn" (click)="previousTrack()">
            <i class="fas fa-step-backward"></i>
          </button>
          
          <button class="play-pause-btn" (click)="togglePlayPause()">
            <i [class]="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
          </button>
          
          <button class="control-btn" (click)="nextTrack()">
            <i class="fas fa-step-forward"></i>
          </button>
        </div>
        
        <!-- Barra de progreso -->
        <div class="progress-container">
          <span class="time-display">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar" (click)="seekTo($event)">
            <div class="progress-fill" [style.width.%]="progressPercent"></div>
          </div>
          <span class="time-display">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Controles adicionales -->
      <div class="additional-controls">
        <button class="control-btn" (click)="toggleMute()">
          <i [class]="isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'"></i>
        </button>
        
        <div class="volume-control">
          <input type="range" 
                 min="0" max="1" step="0.1"
                 [value]="volume"
                 (input)="setVolume($event)">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .music-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 90px;
      background: #181818;
      border-top: 1px solid #282828;
      display: flex;
      align-items: center;
      padding: 0 16px;
      z-index: 1000;
      color: white;
    }

    .track-info {
      display: flex;
      align-items: center;
      min-width: 180px;
      width: 30%;
      gap: 12px;
    }

    .track-image {
      width: 56px;
      height: 56px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .track-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .track-details {
      min-width: 0;
      flex: 1;
    }

    .track-name {
      font-size: 14px;
      font-weight: 400;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .track-artist {
      font-size: 11px;
      color: #b3b3b3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .playback-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      max-width: 722px;
    }

    .control-buttons {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }

    .control-btn {
      background: none;
      border: none;
      color: #b3b3b3;
      font-size: 16px;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: color 0.2s;
    }

    .control-btn:hover {
      color: white;
    }

    .play-pause-btn {
      background: white;
      color: black;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
      transition: transform 0.1s;
    }

    .play-pause-btn:hover {
      transform: scale(1.06);
    }

    .progress-container {
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 500px;
      gap: 12px;
    }

    .time-display {
      font-size: 11px;
      color: #b3b3b3;
      min-width: 40px;
      text-align: center;
    }

    .progress-bar {
      flex: 1;
      height: 4px;
      background: #4f4f4f;
      border-radius: 2px;
      cursor: pointer;
      position: relative;
    }

    .progress-bar:hover {
      height: 6px;
    }

    .progress-fill {
      height: 100%;
      background: #1db954;
      border-radius: 2px;
      transition: width 0.1s;
    }

    .additional-controls {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      min-width: 180px;
      width: 30%;
      gap: 8px;
    }

    .volume-control {
      width: 93px;
    }

    .volume-control input {
      width: 100%;
      height: 4px;
      background: #4f4f4f;
      outline: none;
      border-radius: 2px;
      cursor: pointer;
    }

    .volume-control input::-webkit-slider-thumb {
      appearance: none;
      width: 12px;
      height: 12px;
      background: #1db954;
      border-radius: 50%;
      cursor: pointer;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .additional-controls {
        display: none;
      }
      
      .track-info {
        width: 40%;
      }
      
      .playback-controls {
        width: 60%;
      }
    }
  `]
})
export class MusicBarComponent implements OnInit, OnDestroy {
  currentTrack: Track | null = null;
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 0.8;
  isMuted = false;

  private subscriptions: Subscription[] = [];

  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del reproductor
    this.subscriptions.push(
      this.audioService.currentTrack$.subscribe(track => {
        this.currentTrack = track;
      }),
      
      this.audioService.isPlaying$.subscribe(playing => {
        this.isPlaying = playing;
      }),
      
      this.audioService.currentTime$.subscribe(time => {
        this.currentTime = time || 0;
      }),
      
      this.audioService.duration$.subscribe(duration => {
        this.duration = duration || 0;
      }),
      
      this.audioService.volume$.subscribe(vol => {
        this.volume = vol || 0.8;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  togglePlayPause(): void {
    this.audioService.togglePlayPause();
  }

  previousTrack(): void {
    this.audioService.previous();
  }

  nextTrack(): void {
    this.audioService.next();
  }

  seekTo(event: MouseEvent): void {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const seekTime = percent * this.duration;
    this.audioService.seek(seekTime);
  }

  setVolume(event: any): void {
    const volume = parseFloat(event.target.value);
    this.audioService.setVolume(volume);
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.audioService.setVolume(this.isMuted ? 0 : this.volume);
  }

  get progressPercent(): number {
    if (!this.duration) return 0;
    return (this.currentTime / this.duration) * 100;
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getArtistNames(artists: any[]): string {
    return artists?.map(artist => artist.name).join(', ') || 'Artista desconocido';
  }
}