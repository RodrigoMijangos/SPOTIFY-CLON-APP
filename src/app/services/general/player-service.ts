import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Track } from '../../interfaces/track';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  public currentTrack$: Observable<Track | null> = this.currentTrackSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  public isPlaying$: Observable<boolean> = this.isPlayingSubject.asObservable();

  private currentTimeSubject = new BehaviorSubject<number>(0);
  public currentTime$: Observable<number> = this.currentTimeSubject.asObservable();

  private volumeSubject = new BehaviorSubject<number>(100);
  public volume$: Observable<number> = this.volumeSubject.asObservable();

  constructor() {}

  // Setters
  setCurrentTrack(track: Track): void {
    this.currentTrackSubject.next(track);
  }

  setIsPlaying(isPlaying: boolean): void {
    this.isPlayingSubject.next(isPlaying);
  }

  setCurrentTime(time: number): void {
    this.currentTimeSubject.next(time);
  }

  setVolume(volume: number): void {
    this.volumeSubject.next(volume);
  }

  // Getters
  getCurrentTrack(): Track | null {
    return this.currentTrackSubject.value;
  }

  getIsPlaying(): boolean {
    return this.isPlayingSubject.value;
  }

  getCurrentTime(): number {
    return this.currentTimeSubject.value;
  }

  getVolume(): number {
    return this.volumeSubject.value;
  }
}