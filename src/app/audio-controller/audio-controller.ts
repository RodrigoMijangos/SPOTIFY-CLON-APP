import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SpotifyAlbumService } from '../services/spotify-api/spotify-album-service';
import { Track } from '../interfaces/track';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-audio-controller',
  standalone: false,
  templateUrl: './audio-controller.html',
  styleUrl: './audio-controller.css'
})
export class AudioController implements OnInit, OnDestroy {

  @ViewChild('audio', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('controlBar', { static: true }) controlBarRef!: ElementRef<HTMLInputElement>;

  private tracks: Track[] = [];
  private currentIndex: number = 0;
  private albumSub!: Subscription;
  isPlaying = false;

  constructor(
    private _spotifyAlbum: SpotifyAlbumService
  ){
  }

  ngOnInit(): void {
    // Load the same demo album the Player component uses
    this.albumSub = this._spotifyAlbum.getAlbum('4aawyAB9vmqN3uQ7FjRGTy').subscribe(album => {
      this.tracks = album.tracks ?? [];
      this.currentIndex = 0;
      this.loadTrack(this.currentIndex);
    });

    const audio = this.audioRef.nativeElement;
    audio.addEventListener('timeupdate', () => this.onTimeUpdate());
    audio.addEventListener('ended', () => this.next());
  }

  ngOnDestroy(): void {
    this.albumSub?.unsubscribe();
  }

  private loadTrack(index: number){
    const audio = this.audioRef.nativeElement;
    const track = this.tracks?.[index];
    if(!track || !track.preview_url){
      audio.src = '';
      this.isPlaying = false;
      return;
    }

    audio.src = track.preview_url;
    audio.load();
    this.play();
  }

  play(){
    const audio = this.audioRef.nativeElement;
    audio.play();
    this.isPlaying = true;
  }

  pause(){
    const audio = this.audioRef.nativeElement;
    audio.pause();
    this.isPlaying = false;
  }

  togglePlay(){
    if(this.isPlaying) this.pause(); else this.play();
  }

  next(){
    if(this.tracks.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
    this.loadTrack(this.currentIndex);
  }

  prev(){
    if(this.tracks.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
    this.loadTrack(this.currentIndex);
  }

  private onTimeUpdate(){
    const audio = this.audioRef.nativeElement;
    const control = this.controlBarRef.nativeElement;
    if(audio.duration && !isNaN(audio.duration)){
      control.max = String(Math.floor(audio.duration));
      control.value = String(Math.floor(audio.currentTime));
    }
  }

}
