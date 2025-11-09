import { Component, OnInit, signal } from '@angular/core';
import { Album } from 'src/app/interfaces/album';
import { ActivatedRoute } from '@angular/router';
import { SpotifySearchService } from '../../services/general/spotify-search-service';
import { PlayerStateService } from '../../services/general/player-state.service';

@Component({
  selector: 'app-search-results',
  standalone: false,
  templateUrl: './search-results.html',
  styleUrl: './search-results.css'
})
export class SearchResults implements OnInit {

  searchResults = signal<Album[]>([]);
  isLoading = signal(false);
  searchQuery = signal('');

  constructor(
    private route: ActivatedRoute,
    private searchService: SpotifySearchService,
    private playerState: PlayerStateService
  ) {}

  searchError = signal<string | null>(null);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      if (query) {
        this.searchQuery.set(query);
        this.performSearch(query);
      }
    });
  }

  private performSearch(query: string) {
    this.isLoading.set(true);
    this.searchError.set(null);
    
    console.log('🎵 Iniciando búsqueda en SearchResults para:', query);
    
    this.searchService.search(query).subscribe({
      next: (results) => {
        console.log('📝 Resultados recibidos:', results.length);
        this.searchResults.set(results);
        this.isLoading.set(false);
      },
      error: (error: Error) => {
        console.error('❌ Error en SearchResults:', error);
        this.searchError.set(error.message);
        this.searchResults.set([]);
        this.isLoading.set(false);
      }
    });
  }

  onAlbumClick(album: Album) {
    this.playerState.selectAlbum(album);
  }
}
