import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { SpotifySearchService } from '../services/spotify-api/spotify-search-service';
import { AudioPlayerService } from '../services/audio/audio-player.service';
import { Track } from '../interfaces/track';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styleUrl: './search.css'
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
  formatDuration(duration: number): string {
    if (!duration) return '0:00';
    const m = Math.floor(duration / 60000), s = Math.floor((duration % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
  getArtistNames(artists: any[]): string { return artists?.map(artist => artist.name).join(', ') || 'Artista desconocido'; }
}