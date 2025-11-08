import { Component, ElementRef, ViewChild, signal, Input } from '@angular/core';
import { Track } from '../../../interfaces/track';
import { PlayerStateService } from '../../../services/general/player-state.service';

@Component({
  selector: 'app-audio-controller',
  standalone: false,
  templateUrl: './audio-controller.html',
  styleUrl: './audio-controller.css'
})
export class AudioController {
  @ViewChild('audio') audioElement!: ElementRef<HTMLAudioElement>;
  @Input() currentSong?: Track;
  @Input() playlist: Track[] = [];

  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);
  progress = signal(0);
  currentIndex = 0;

  ngAfterViewInit() {
    const audio = this.audioElement.nativeElement;
    
    if (this.currentSong?.preview_url) {
      this.loadSong(this.currentSong);
    }
    
    // Actualiza el tiempo actual y el progreso mientras se reproduce
    audio.addEventListener('timeupdate', () => {
      this.currentTime.set(audio.currentTime);
      this.progress.set((audio.currentTime / audio.duration) * 100 || 0);
    });

    // Cuando se carga la metadata del audio (incluyendo duración)
    audio.addEventListener('loadedmetadata', () => {
      // Para previews de Spotify, la duración es típicamente 30 segundos
      this.duration.set(audio.duration);
      // También actualizamos el valor máximo de la barra de progreso
      const progressBar = document.getElementById('control-bar') as HTMLInputElement;
      if (progressBar) {
        progressBar.max = audio.duration.toString();
      }
    });

    // Cuando termina la canción
    audio.addEventListener('ended', () => {
      this.isPlaying.set(false);
      this.currentTime.set(0);
      this.progress.set(0);
      this.playNext();
    });
  }

  togglePlay() {
    const audio = this.audioElement.nativeElement;
    
    if (this.isPlaying()) {
      audio.pause();
      this.isPlaying.set(false);
    } else {
      audio.play();
      this.isPlaying.set(true);
    }
  }

  playPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.playlist.length - 1;
    }
    this.loadSong(this.playlist[this.currentIndex]);
  }

  playNext() {
    if (this.currentIndex < this.playlist.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    this.loadSong(this.playlist[this.currentIndex]);
  }

  loadSong(song: Track) {
    if (!song?.preview_url) {
      console.error('Esta canción no tiene vista previa disponible');
      return;
    }

    const audio = this.audioElement.nativeElement;
    this.currentSong = song;
    audio.src = song.preview_url;
    
    if (this.isPlaying()) {
      audio.play();
    }
  }

  seekTo(event: Event) {
    const input = event.target as HTMLInputElement;
    const audio = this.audioElement.nativeElement;
    const seekTime = (Number(input.value) / 100) * audio.duration;
    audio.currentTime = seekTime;
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    
    // Convertir a minutos y segundos
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    // Asegurar que los segundos siempre tengan dos dígitos
    const formattedSecs = secs.toString().padStart(2, '0');
    
    return `${mins}:${formattedSecs}`;
  }
}