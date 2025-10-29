import { Component, inject } from '@angular/core';
import { AudioService } from '../services/audio';
@Component({
  selector: 'app-audio-controller',
  standalone: false,
  templateUrl: './audio-controller.html',
  styleUrl: './audio-controller.css'
})
export class AudioController {

  private audioService = inject(AudioService);

  public isPlaying = this.audioService.isPlaying;
  public currentTime = this.audioService.currentTime;
  public duration = this.audioService.duration;

  // Métodos que el HTML llamará
  onTogglePlayPause() {
    this.audioService.togglePlayPause();
  }

  onNext() {
    this.audioService.next();
  }

  onPrevious() {
    this.audioService.previous();
  }
  // Barra de progreso.
  onSeek(event: Event) {
    const input = event.target as HTMLInputElement;
    this.audioService.seekTo(Number(input.value));
  }
}
