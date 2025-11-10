import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { SpotifyApiService } from '../../core/services/spotify-api.service';
import { AudioService } from '../../core/services/audio.service';
import { Track, SearchResult } from '../../core/models/track.model';

@Component({
  selector: 'app-search',
  template: `
    <div class="container">
      <div class="search-box">
        <input 
          #searchInput
          type="text" 
          placeholder="Buscar música..." 
          (input)="onSearch($event)"
          class="search-input">
      </div>
      
      <div *ngIf="results.tracks.length > 0" class="results">
        <div class="main-track" *ngIf="results.tracks[0] as track">
          <img [src]="track.album.images[0]?.url" alt="cover" class="cover">
          <div class="info">
            <h2>{{ track.name }}</h2>
            <p>{{ track.artists[0]?.name }}</p>
          </div>
          <div class="controls">
            <button (click)="play(track)" class="btn-play">▶</button>
          </div>
        </div>
        
        <div class="track-list">
          <div 
            *ngFor="let track of results.tracks.slice(1); let i = index" 
            class="track-item"
            (click)="play(track)">
            <span class="number">{{ i + 2 }}</span>
            <img [src]="track.album.images[0]?.url" alt="cover" class="thumb">
            <div class="details">
              <div class="name">{{ track.name }}</div>
              <div class="artist">{{ track.artists[0]?.name }}</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { background: #000; color: white; min-height: 100vh; padding: 20px; }
    .search-box { margin-bottom: 30px; }
    .search-input { width: 100%; padding: 12px; border-radius: 25px; border: none; background: #333; color: white; font-size: 16px; }
    .main-track { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; padding: 20px; background: #111; border-radius: 10px; }
    .cover { width: 200px; height: 200px; border-radius: 10px; }
    .info h2 { margin: 0 0 10px 0; font-size: 32px; }
    .info p { margin: 0; color: #aaa; }
    .controls { display: flex; gap: 10px; margin-left: auto; }
    .btn-play, .btn-download { padding: 15px 20px; border: none; border-radius: 50px; cursor: pointer; font-size: 16px; }
    .btn-play { background: #1db954; color: white; }
    .btn-download { background: #ff6b35; color: white; }
    .track-list { display: flex; flex-direction: column; gap: 5px; }
    .track-item { display: flex; align-items: center; gap: 15px; padding: 10px; background: #111; border-radius: 5px; cursor: pointer; }
    .track-item:hover { background: #222; }
    .number { width: 20px; color: #aaa; }
    .thumb { width: 40px; height: 40px; border-radius: 5px; }
    .details { flex: 1; }
    .name { font-weight: 500; }
    .artist { color: #aaa; font-size: 14px; }
    .btn-download-small { background: #ff6b35; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; }
  `],
  standalone: false
})
export class SearchComponent implements OnInit {
  results: SearchResult = { tracks: [], albums: [], artists: [] };
  private searchSubject = new Subject<string>();
  
  constructor(
    private spotify: SpotifyApiService,
    private audio: AudioService
  ) {}
  
  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => query ? this.spotify.searchAll(query) : of({ tracks: [], albums: [], artists: [] }))
    ).subscribe(results => {
      this.results = results;
    });
  }
  
  onSearch(event: any): void {
    this.searchSubject.next(event.target.value);
  }
  
  play(track: Track): void {
    this.audio.setPlaylist(this.results.tracks);
    this.audio.playTrack(track);
  }
}