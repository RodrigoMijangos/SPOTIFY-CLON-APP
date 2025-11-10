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
    .search-container { background: #121212; color: white; min-height: 100vh; padding-bottom: 120px; padding-top: 80px; }
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
    .track-item { display: flex; align-items: center; padding: 12px; border-radius: 4px; cursor: pointer; transition: background 0.2s; }
    .track-item:hover { background: #1a1a1a; }
    .track-number { width: 30px; text-align: center; color: #b3b3b3; }
    .track-image { width: 40px; height: 40px; margin: 0 12px; border-radius: 4px; overflow: hidden; }
    .track-image img { width: 100%; height: 100%; object-fit: cover; }
    .track-details { flex: 1; min-width: 0; }
    .track-details h4 { margin: 0; font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .track-details p { margin: 0; color: #b3b3b3; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .track-duration { color: #b3b3b3; font-size: 14px; }

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
    
    /* Estilos simplificados - solo Angular */
    .track-details { cursor: pointer; flex: 1; }
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
      switchMap(consulta => consulta.trim().length > 2 ? (this.isSearching = true, this._searchService.buscar(consulta)) : (this.isSearching = this.showResults = false, []))
    ).subscribe({
      next: (resultados: any) => (this.searchResults = resultados, this.isSearching = false, this.showResults = true),
      error: () => (this.isSearching = this.showResults = false)
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  onSearchInput(event: any): void { this.searchQuery = event.target.value; this.searchSubject.next(this.searchQuery); }
  clearSearch(): void { this.searchQuery = ''; this.showResults = false; this.searchResults = { tracks: [], albums: [], artists: [], playlists: [] }; }

  reproducirCancion(cancion: any): void {
    if (this.searchResults.tracks?.length > 0) this._audioPlayer.setPlaylist(this.searchResults.tracks);
    this._audioPlayer.playTrack(cancion);
  }

  cancionAnterior(): void { this._audioPlayer.previous(); }
  siguienteCancion(): void { this._audioPlayer.next(); }
  
  // Funcionalidad de descarga removida - solo Angular puro

  formatearDuracion(duracion: number): string {
    if (!duracion) return '0:00';
    const minutos = Math.floor(duracion / 60000), segundos = Math.floor((duracion % 60000) / 1000);
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  }
  obtenerNombresArtistas(artistas: any[]): string { return artistas?.map(artista => artista.name).join(', ') || 'Artista desconocido'; }
}