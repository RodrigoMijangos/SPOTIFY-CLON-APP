import { Injectable } from '@angular/core';
import { Track } from '../../interfaces/track';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private _playlist = new BehaviorSubject<Track[]>([]);
  private _currentTrack = new BehaviorSubject<Track | null>(null);
  private _isPlaying = new BehaviorSubject<boolean>(false);
  private _currentIndex = 0;

  // Observables públicos para que los componentes se suscriban
  readonly playlist$ = this._playlist.asObservable();
  readonly currentTrack$ = this._currentTrack.asObservable();
  readonly isPlaying$ = this._isPlaying.asObservable();

  constructor() {}

  setPlaylist(tracks: Track[]) {
    this._playlist.next(tracks);
    // Si no hay track actual, establecer el primero
    if (!this._currentTrack.value && tracks.length > 0) {
      this._currentIndex = 0;
      this._currentTrack.next(tracks[0]);
    }
  }

  playTrack(track: Track) {
    const playlist = this._playlist.value;
    const index = playlist.findIndex(t => t.id === track.id);
    if (index !== -1) {
      this._currentIndex = index;
      this._currentTrack.next(track);
      this._isPlaying.next(true);
    }
  }

  togglePlay() {
    this._isPlaying.next(!this._isPlaying.value);
  }

  next() {
    const playlist = this._playlist.value;
    if (playlist.length === 0) return;
    
    this._currentIndex = (this._currentIndex + 1) % playlist.length;
    this._currentTrack.next(playlist[this._currentIndex]);
    if (this._isPlaying.value) {
      // Mantener reproduciendo si ya estaba reproduciendo
      this._isPlaying.next(true);
    }
  }

  prev() {
    const playlist = this._playlist.value;
    if (playlist.length === 0) return;
    
    this._currentIndex = (this._currentIndex - 1 + playlist.length) % playlist.length;
    this._currentTrack.next(playlist[this._currentIndex]);
    if (this._isPlaying.value) {
      // Mantener reproduciendo si ya estaba reproduciendo
      this._isPlaying.next(true);
    }
  }

  getCurrentTrackIndex(): number {
    return this._currentIndex;
  }
}