import { Injectable, signal } from '@angular/core';
import { Track } from '../interfaces/track';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  
  private audio = new Audio();
  private playlist: Track[] = [];
  private currentTrackIndex = -1; 

  public currentSong = signal<Track | undefined>(undefined);
  public isPlaying = signal(false);
  public duration = signal(0);
  public currentTime = signal(0);
  
  constructor() {
    this.audio.addEventListener('loadedmetadata', () => this.duration.set(this.audio.duration));
    this.audio.addEventListener('timeupdate', () => this.currentTime.set(this.audio.currentTime));
    this.audio.addEventListener('ended', () => this.playNextValidSong(true));
  }

  setPlaylist(tracks: Track[]) {
    this.playlist = tracks;
  }


  playSong(song: Track) {
    if (!song || !song.preview_url) {
      console.error(`Error: La canción '${song?.name}' no tiene preview_url.`);
      this.isPlaying.set(false);
      return; 
    }

    this.currentSong.set(song);
    this.audio.src = song.preview_url;
    this.audio.play();
    this.isPlaying.set(true);
    this.currentTrackIndex = this.playlist.findIndex(track => track.id === song.id);
  }

  togglePlayPause() {
    if (this.audio.paused) {
      if (this.audio.src) {
        this.audio.play();
        this.isPlaying.set(true);
      } else {
        this.playNextValidSong(false); 
      }
    } else {
      this.audio.pause();
      this.isPlaying.set(false);
    }
  }

  next() {
    this.playNextValidSong(true); 
  }

  previous() {
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0; 
    } else {
      this.playNextValidSong(false); 
    }
  }

  
  private playNextValidSong(isNext: boolean) {
    if (this.playlist.length === 0) return;

    let attempts = 0;
    let newIndex = this.currentTrackIndex;

    do {
      if (isNext) {
        newIndex = (newIndex + 1) % this.playlist.length; 
      } else {
        newIndex = (newIndex - 1 + this.playlist.length) % this.playlist.length; 
      }
      
      attempts++;
      
      // Si dimos la vuelta completa y no encontramos nada, paramos.
      if (attempts > this.playlist.length) {
        console.error("No se encontró ninguna canción con preview_url en la lista.");
        this.audio.pause();
        this.isPlaying.set(false);
        return;
      }
      
    } while (!this.playlist[newIndex].preview_url); 

    this.playSong(this.playlist[newIndex]);
  }

  seekTo(time: number) {
    this.audio.currentTime = time;
  }
}