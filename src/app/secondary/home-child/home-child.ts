// src/app/secondary/home-child/home-child.ts
import { Component, inject, signal } from '@angular/core';
import { SpotifySearchService } from '../../services/spotify-api/spotify-search';
import { SpotifyArtistResponse } from '../../interfaces/spotify-api/spotify-artist-response';
import { SpotifyTrackResponse } from '../../interfaces/spotify-api/spotify-track-response';
import { SpotifyAlbumResponse } from '../../interfaces/spotify-api/spotify-album-response';

@Component({
  selector: 'app-home-child',
  templateUrl: './home-child.html',
  styleUrl: './home-child.css'
})
export class HomeChild {

  // Inyectamos el "cerebro" de la búsqueda
  private searchService = inject(SpotifySearchService);

  // --- Creamos Signals para guardar los resultados ---
  // (signal() es la forma nueva de Angular de manejar variables que cambian)
  public tracks = signal<SpotifyTrackResponse[]>([]);
  public artists = signal<SpotifyArtistResponse[]>([]);
  public albums = signal<SpotifyAlbumResponse[]>([]);

  /**
   * Esta función la llama el <input> al presionar "Enter"
   */
  buscar(query: string) {
    // Si la búsqueda está vacía, no hacemos nada
    if (query.trim() === '') {
      this.tracks.set([]);
      this.artists.set([]);
      this.albums.set([]);
      return;
    }

    console.log(`Buscando: ${query}`);

    this.searchService.search(query).subscribe(response => {
      // ¡Recibimos los resultados!
      console.log(response);

      // Guardamos cada cosa en su signal correspondiente
      this.tracks.set(response.tracks.items);
      this.artists.set(response.artists.items);
      this.albums.set(response.albums.items);
    });
  }
}