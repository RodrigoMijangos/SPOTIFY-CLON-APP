import { Injectable, signal, effect } from '@angular/core';
import { Track } from '../interfaces/track'; 

@Injectable({
  providedIn: 'root' 
})
export class AudioService {
  
  private audio = new Audio();
  private playlist: Track[] = [];
  private currentTrackIndex = 0;

  public currentSong = signal<Track | undefined>(undefined);
  public isPlaying = signal(false);
  public duration = signal(0);
  public currentTime = signal(0);
  
  constructor() {
    this.audio.addEventListener('play', () => this.isPlaying.set(true));
    this.audio.addEventListener('pause', () => this.isPlaying.set(false));
    this.audio.addEventListener('loadedmetadata', () => this.duration.set(this.audio.duration));
    this.audio.addEventListener('timeupdate', () => this.currentTime.set(this.audio.currentTime));
    this.audio.addEventListener('ended', () => this.next());
  }

  //Aquí lo llama la playlist para mostrar las canciones que tiene.
  setPlaylist(tracks: Track[]) {
    this.playlist = tracks;
  }

  playSong(song: Track) {
    this.currentSong.set(song);
    this.audio.src = song.preview_url;
    this.audio.play();
    
    // Guardamos el índice actual para 'next' y 'previous'.
    this.currentTrackIndex = this.playlist.findIndex(track => track.id === song.id);
  }

  togglePlayPause() {
    if (this.audio.paused) {
      if (this.audio.src) {
        this.audio.play();
      } else if (this.playlist.length > 0) {
        // Si no hay canción cargada, reproduce la primera de la lista.
        this.playSong(this.playlist[0]);
      }
    } else {
      this.audio.pause();
    }
  }

  next() {
    if (this.playlist.length === 0) return;
    
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length; 
    const nextSong = this.playlist[this.currentTrackIndex];
    this.playSong(nextSong);
  }

  previous() {
    if (this.playlist.length === 0) return;
    if (this.audio.currentTime > 3) {
      // Si la canción ya avanzó, solo la reinicia.
      this.audio.currentTime = 0;
    } else {
      // Si no, va a la canción anterior.
      this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
      const prevSong = this.playlist[this.currentTrackIndex];
      this.playSong(prevSong);
    }
  }

  // Aquí lo llamamos a la barra del progreso.
  seekTo(time: number) {
    this.audio.currentTime = time;
  }
}