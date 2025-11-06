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
    // Configurar búsqueda con debounce
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.trim().length > 2) {
          this.isSearching = true;
          return this._searchService.search(query);
        } else {
          this.isSearching = false;
          this.showResults = false;
          return [];
        }
      })
    ).subscribe({
      next: (results: any) => {
        this.searchResults = results;
        this.isSearching = false;
        this.showResults = true;
      },
      error: (error) => {
        console.error('Error en búsqueda:', error);
        this.isSearching = false;
        this.showResults = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onSearchInput(event: any): void {
    this.searchQuery = event.target.value;
    this.searchSubject.next(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.showResults = false;
    this.searchResults = {
      tracks: [],
      albums: [],
      artists: [],
      playlists: []
    };
  }

  playTrack(track: any): void {
    // Convertir el track de Spotify al formato interno
    const formattedTrack: Track = {
      id: track.id,
      name: track.name,
      artists: track.artists,
      album: track.album,
      duration_ms: track.duration_ms,
      preview_url: track.preview_url,
      external_urls: track.external_urls,
      href: track.href,
      popularity: track.popularity,
      track_number: track.track_number,
      type: track.type,
      uri: track.uri,
      is_local: track.is_local
    };

    // Si hay resultados de tracks, establecer como playlist
    if (this.searchResults.tracks?.length > 0) {
      const trackList = this.searchResults.tracks.map((t: any): Track => ({
        id: t.id,
        name: t.name,
        artists: t.artists,
        album: t.album,
        duration_ms: t.duration_ms,
        preview_url: t.preview_url,
        external_urls: t.external_urls,
        href: t.href,
        popularity: t.popularity,
        track_number: t.track_number,
        type: t.type,
        uri: t.uri,
        is_local: t.is_local
      }));
      
      this._audioPlayer.setPlaylist(trackList);
    }
    
    this._audioPlayer.playTrack(formattedTrack);
  }

  playAlbum(album: any): void {
    // Implementar reproducción de álbum completo
    console.log('Reproducir álbum:', album);
  }

  followArtist(artist: any): void {
    // Implementar seguir artista
    console.log('Seguir artista:', artist);
  }

  formatDuration(duration: number): string {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getArtistNames(artists: any[]): string {
    return artists?.map(artist => artist.name).join(', ') || 'Artista desconocido';
  }
}