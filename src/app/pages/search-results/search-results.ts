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
  searchQuery = signal('');

  constructor(
    private route: ActivatedRoute,
    private searchService: SpotifySearchService,
    private playerState: PlayerStateService
  ) { }

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
    this.searchError.set(null);

    console.log('Iniciando búsqueda en SearchResults para:', query);

    this.searchService.search(query).subscribe({
      next: (results) => {
        console.log('Resultados recibidos:', results.length);
        this.searchResults.set(results);
        const validResults = results.filter(album => album.id && album.id.length > 0);
        console.log('Resultados válidos:', validResults.length);
        this.searchResults.set(validResults);
      },
      error: (error: Error) => {
        console.error('Error en SearchResults:', error);
        this.searchError.set(error.message);
        this.searchResults.set([]);
      }
    });
  }

  onAlbumClick(album: Album) {
    if (!album.id) {
      console.error('Álbum sin ID:', album);
      this.searchError.set('Este álbum no tiene un ID válido');
      return;
    }

    console.log('Álbum seleccionado:', album.name, 'ID:', album.id);
    this.playerState.selectAlbum(album);

  }
}
