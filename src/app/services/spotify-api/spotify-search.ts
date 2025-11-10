import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroments } from '../../../environments/environment.development';
import { SpotifySearchResponse } from '../../interfaces/spotify-api/spotify-search-response'; // <-- ¡Esta la crearemos!

@Injectable({
  providedIn: 'root'
})
export class SpotifySearchService {

  private _http = inject(HttpClient);

  /**
   * Llama al endpoint de búsqueda de Spotify
   * @param query El término a buscar (ej. "José José")
   */
  search(query: string): Observable<SpotifySearchResponse> {

    const params = {
      q: query,
      type: 'track,artist,album', // Buscamos los 3 tipos
      market: 'US', // Opcional, pero ayuda a filtrar
      limit: '10' // Traemos 10 de cada tipo
    };

    return this._http.get<SpotifySearchResponse>(
      `${enviroments.API_URL}/search`, 
      { params } // Pasamos los parámetros de búsqueda
    );
  }
}