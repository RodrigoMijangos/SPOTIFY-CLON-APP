import { Component, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { SpotifyApiService } from '../core/services/spotify-api.service';
import { AudioService } from '../core/services/audio.service';
import { Track } from '../core/models/track.model';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styles: [`
    .search-container { background: #121212; color: white; min-height: 100vh; padding-bottom: 120px; padding-top: 20px; }
    .search-results { display: block; width: 100%; padding: 0 20px; }
    
    .search-header { margin-bottom: 32px; padding: 0 24px; }
    .search-bar { position: relative; max-width: 400px; margin: 0 auto; }
    .search-input { width: 100%; background: rgba(255,255,255,0.1); border: none; border-radius: 25px; padding: 12px 20px; color: white; outline: none; font-size: 16px; }
    .search-input::placeholder { color: rgba(255,255,255,0.6); }
    .search-input:focus { background: rgba(255,255,255,0.15); }
    .clear-btn { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); background: none; border: none; color: white; cursor: pointer; font-size: 20px; }
    
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
    .track-item { display: flex; align-items: center; padding: 12px; border-radius: 4px; transition: background 0.2s; }
    .track-item:hover { background: #1a1a1a; }
    .track-number { width: 30px; text-align: center; color: #b3b3b3; }
    .track-image { width: 40px; height: 40px; margin: 0 12px; border-radius: 4px; overflow: hidden; }
    .track-image img { width: 100%; height: 100%; object-fit: cover; }
    .track-details { flex: 1; min-width: 0; cursor: pointer; }
    .track-details h4 { margin: 0; font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .track-details p { margin: 0; color: #b3b3b3; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .track-duration { color: #b3b3b3; font-size: 14px; margin-right: 12px; }
    
    .download-btn { background: #1db954; }
    .download-btn:hover { background: #1ed760; }
    .track-actions { display: flex; align-items: center; gap: 8px; }
    .download-track-btn { background: #1db954; border: none; color: white; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; }
    .download-track-btn:hover { background: #1ed760; }
    .preview-badge { background: #1db954; color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; margin-left: 8px; }

    /* Vista por defecto mejorada */
    .default-view { padding: 20px; }
    .default-player { border-radius: 20px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
    .default-background { background: linear-gradient(145deg, #1a237e 0%, #3949ab 30%, #5c6bc0 70%, #42a5f5 100%); position: relative; min-height: 450px; }
    .default-overlay { padding: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; }
    .default-album { width: 200px; height: 200px; border-radius: 50%; background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1)); border: 4px solid rgba(255,255,255,0.4); box-shadow: 0 8px 32px rgba(0,0,0,0.3); margin-bottom: 40px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
    .default-album .fa-music { font-size: 60px; color: rgba(255,255,255,0.8); }
    .default-info { margin-bottom: 30px; }
    .default-info h1 { font-size: 28px; font-weight: 300; margin-bottom: 8px; color: rgba(255,255,255,0.95); }
    .default-info p { font-size: 16px; opacity: 0.7; color: rgba(255,255,255,0.8); }
    .default-controls { display: flex; align-items: center; gap: 25px; }
    .default-controls .control-btn { background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3); color: white; width: 56px; height: 56px; border-radius: 50%; backdrop-filter: blur(10px); }
    .default-controls .play-btn { background: rgba(255,255,255,0.9); color: #1a237e; width: 64px; height: 64px; border: none; }
    .default-controls .control-btn:hover { background: rgba(255,255,255,0.3); transform: scale(1.05); }
    .default-controls .play-btn:hover { background: white; transform: scale(1.1); }
    
    /* Estilos para mensajes */
    .preview-badge { font-size: 12px; color: #1db954; margin-left: 8px; }
    .no-results-message { padding: 40px; text-align: center; background: rgba(255,255,255,0.05); border-radius: 12px; margin: 20px; }
    .message-content h3 { color: white; margin-bottom: 16px; font-size: 24px; }
    .message-content p { color: #b3b3b3; margin-bottom: 16px; }
    
    .demo-notice { background: rgba(29, 185, 84, 0.15); border: 1px solid rgba(29, 185, 84, 0.5); border-radius: 8px; padding: 16px; margin-top: 20px; }
    .demo-notice p { color: #1ed760; margin: 0; font-size: 14px; font-weight: 500; }
    
    .track-details { cursor: pointer; flex: 1; }
    .track-duration { color: #b3b3b3; font-size: 14px; }

    /* Estilos para álbumes */
    .albums-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
    .album-card { background: rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.3s ease; }
    .album-card:hover { background: rgba(255,255,255,0.15); transform: translateY(-5px); }
    .album-image { width: 100%; aspect-ratio: 1; border-radius: 8px; overflow: hidden; margin-bottom: 12px; }
    .album-image img { width: 100%; height: 100%; object-fit: cover; }
    .album-info h3 { color: white; font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    .album-info p { color: #b3b3b3; font-size: 14px; }

    /* Estilos para artistas */
    .artists-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; margin-top: 20px; }
    .artist-card { background: rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; text-align: center; cursor: pointer; transition: all 0.3s ease; }
    .artist-card:hover { background: rgba(255,255,255,0.15); transform: translateY(-5px); }
    .artist-image { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; margin: 0 auto 12px; }
    .artist-image img { width: 100%; height: 100%; object-fit: cover; }
    .artist-info h3 { color: white; font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    .artist-info p { color: #b3b3b3; font-size: 14px; }
  `]
})
export class SearchComponent implements OnInit, OnDestroy {

  searchQuery = '';
  searchResults: any = {
    tracks: [],
    albums: [],
    artists: []
  };
  isSearching = false;
  showResults = false;
  activeTab: 'tracks' | 'albums' | 'artists' = 'tracks';

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  constructor(
    private spotify: SpotifyApiService,
    private audio: AudioService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query && query.trim().length > 1) {
          this.isSearching = true;
          console.log('Buscando:', query);
          return this.spotify.searchAll(query.trim());
        } else {
          this.isSearching = false;
          this.showResults = false;
          return of({ tracks: [], albums: [], artists: [] });
        }
      })
    ).subscribe({
      next: (results) => {
        console.log('Resultados recibidos en componente:', results);
        this.searchResults = results;
        if (results.tracks?.length > 0 || results.albums?.length > 0 || results.artists?.length > 0) {
          this.audio.setPlaylist(results.tracks);
          this.showResults = true;
        } else {
          this.showResults = false;
        }
        this.isSearching = false;
        this.cdr.detectChanges(); // Force update
      },
      error: () => {
        this.isSearching = false;
        this.showResults = false;
        this.cdr.detectChanges();
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
    this.searchResults = { tracks: [], albums: [], artists: [] };
  }

  reproducirCancion(cancion: any): void {
    this.audio.playTrack(cancion);
  }

  togglePlayPause(): void {
    this.audio.togglePlayPause();
  }

  cancionAnterior(): void {
    this.audio.previous();
  }

  siguienteCancion(): void {
    this.audio.next();
  }

  setActiveTab(tab: 'tracks' | 'albums' | 'artists'): void {
    this.activeTab = tab;
  }

  get currentTrack(): Track | null {
    return this.audio.getCurrentTrackInfo();
  }

  get isPlaying(): boolean {
    return this.audio.isPlaying$.value;
  }

  get playlistInfo(): { current: number; total: number } {
    return this.audio.getPlaylistInfo();
  }

  formatearDuracion(duracion: number): string {
    if (!duracion) return '0:00';
    const minutos = Math.floor(duracion / 60000);
    const segundos = Math.floor((duracion % 60000) / 1000);
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  }
  obtenerNombresArtistas(artistas: any[]): string { return artistas?.map(artista => artista.name).join(', ') || 'Artista desconocido'; }
}