import { Component, ElementRef, ViewChild, signal, Input } from '@angular/core';
import { Song } from '../../../interfaces/song';

@Component({
  selector: 'app-audio-controller',
  standalone: false,
  templateUrl: './audio-controller.html',
  styleUrl: './audio-controller.css'
})
export class AudioController {
  @ViewChild('audio') audioElement!: ElementRef<HTMLAudioElement>;
  @Input() currentSong!: Song;
  @Input() playlist: Song[] = [];

  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);
  progress = signal(0);
  currentIndex = 0;

  ngAfterViewInit() {
    const audio = this.audioElement.nativeElement;
    
    if (this.currentSong?.url) {
      this.currentSong.url;
    }
    
    audio.addEventListener('timeupdate', () => {
      this.currentTime.set(audio.currentTime);
      this.progress.set((audio.currentTime / audio.duration) * 100 || 0);
    });

    audio.addEventListener('loadedmetadata', () => {
      this.duration.set(audio.duration);
    });

    audio.addEventListener('ended', () => {
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

  loadSong(song: Song) {
    const audio = this.audioElement.nativeElement;
    this.currentSong = song;
    audio.src = song.url;
    
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
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}