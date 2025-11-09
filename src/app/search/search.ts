import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { SpotifySearchService } from '../services/spotify-api/spotify-search-service';
import { AudioPlayerService } from '../services/audio/audio-player.service';
import { Track } from '../interfaces/track';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styles: [`
    .search-container { padding: 24px; background: #121212; color: white; min-height: 100vh; padding-bottom: 120px; }
    .search-header { margin-bottom: 24px; }
    .search-bar { position: relative; max-width: 364px; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #b3b3b3; }
    .search-input { width: 100%; background: #242424; border: none; border-radius: 500px; padding: 12px 48px 12px 40px; color: white; outline: none; }
    .search-input:focus { background: #2a2a2a; box-shadow: 0 0 0 2px #1db954; }
    .clear-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #b3b3b3; cursor: pointer; }
    
    .main-player { margin-bottom: 40px; border-radius: 8px; overflow: hidden; }
    .player-background { background-size: cover; background-position: center; position: relative; min-height: 300px; }
    .player-overlay { background: linear-gradient(135deg, rgba(70, 130, 180, 0.8), rgba(32, 178, 170, 0.8)); padding: 60px; display: flex; align-items: center; gap: 40px; }
    .album-art { width: 200px; height: 200px; border-radius: 50%; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
    .album-art img { width: 100%; height: 100%; object-fit: cover; }
    .track-info h1 { font-size: 48px; font-weight: 700; margin-bottom: 8px; }
    .track-info p { font-size: 18px; opacity: 0.9; }
    .player-controls { display: flex; align-items: center; gap: 20px; margin-left: auto; }
    .control-btn, .play-btn { background: rgba(255,255,255,0.2); border: none; color: white; width: 60px; height: 60px; border-radius: 50%; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 12px; transition: all 0.2s; }
    .play-btn { background: white; color: #000; width: 80px; height: 80px; font-size: 16px; }
    .control-btn:hover, .play-btn:hover { transform: scale(1.1); }
    .control-btn span, .play-btn span { font-size: 10px; margin-top: 4px; }
    
    .tracks-section h2 { font-size: 24px; margin-bottom: 16px; }
    .tracks-list { display: flex; flex-direction: column; gap: 8px; }
    .track-item { display: flex; align-items: center; padding: 12px; border-radius: 4px; cursor: pointer; transition: background 0.2s; }
    .track-item:hover { background: #1a1a1a; }
    .track-number { width: 30px; text-align: center; color: #b3b3b3; }
    .track-image { width: 40px; height: 40px; margin: 0 12px; border-radius: 4px; overflow: hidden; }
    .track-image img { width: 100%; height: 100%; object-fit: cover; }
    .track-details { flex: 1; min-width: 0; }
    .track-details h4 { margin: 0; font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .track-details p { margin: 0; color: #b3b3b3; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .track-duration { color: #b3b3b3; font-size: 14px; }
  `]
})
export class SearchComponent implements OnInit, OnDestroy {

  searchQuery = '';
  searchResults: any = {
    tracks: [],
    albums: [],
    artists: [],
    playlists: []
  };
  isSearching = false;
  showResults = false;
  
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private _searchService: SpotifySearchService,
    private _audioPlayer: AudioPlayerService
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300), distinctUntilChanged(),
      switchMap(query => query.trim().length > 2 ? (this.isSearching = true, this._searchService.search(query)) : (this.isSearching = this.showResults = false, []))
    ).subscribe({
      next: (results: any) => (this.searchResults = results, this.isSearching = false, this.showResults = true),
      error: () => (this.isSearching = this.showResults = false)
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onSearchInput(event: any): void { this.searchQuery = event.target.value; this.searchSubject.next(this.searchQuery); }
  clearSearch(): void { this.searchQuery = ''; this.showResults = false; this.searchResults = { tracks: [], albums: [], artists: [], playlists: [] }; }

  playTrack(track: any): void {
    if (this.searchResults.tracks?.length > 0) this._audioPlayer.setPlaylist(this.searchResults.tracks);
    this._audioPlayer.playTrack(track);
  }

  playAlbum(album: any): void { console.log('Reproducir álbum:', album); }
  followArtist(artist: any): void { console.log('Seguir artista:', artist); }
  previousTrack(): void { this._audioPlayer.previous(); }
  nextTrack(): void { this._audioPlayer.next(); }
  formatDuration(duration: number): string {
    if (!duration) return '0:00';
    const m = Math.floor(duration / 60000), s = Math.floor((duration % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
  getArtistNames(artists: any[]): string { return artists?.map(artist => artist.name).join(', ') || 'Artista desconocido'; }
}