import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Album } from 'src/app/interfaces/album';
import { SpotifySearchResponse } from 'src/app/interfaces/spotify-api/spotify-search-response';
import { Image } from 'src/app/interfaces/image';

@Injectable({
  providedIn: 'root'
})
export class SpotifySearchService {
  constructor(private http: HttpClient) { }

  search(query: string): Observable<Album[]> {
    console.log('🔍 Iniciando búsqueda para:', query);

    const searchUrl = `${environment.API_URL}/search?q=${query}&type=album,artist&limit=20`;
    console.log('🌐 URL de búsqueda:', searchUrl);

    return this.http.get<SpotifySearchResponse>(searchUrl).pipe(
      map(response => {
        console.log('✅ Respuesta recibida de Spotify:', response);

        // Si hay resultados de artistas
        if (response.artists?.items && response.artists.items.length > 0) {
          console.log(`👤 Encontrados ${response.artists.items.length} artistas`);
          const artistResults = response.artists.items.map(artist => {
            console.log(`  - Procesando artista: ${artist.name}`);
            return {
              id: artist.id || '',
              name: artist.name || '',
              total_tracks: 0,
              images: artist.images?.map(img => {
                const image: Image = {
                  width: img.width || 0,
                  height: img.height || 0,
                  url: img.url || ''
                };
                return image;
              }) || [],
              href: artist.href || '',
              tracks: []
            };
          });
          console.log('✨ Resultados de artistas procesados');
          return artistResults;
        }

        // Si hay resultados de álbumes
        if (response.albums?.items && response.albums.items.length > 0) {
          console.log(`💿 Encontrados ${response.albums.items.length} álbumes`);
          const albumResults = response.albums.items.map(album => {
            console.log(`  - Procesando álbum: ${album.name}`);
            return {
              id: album.id || '',
              name: album.name || '',
              total_tracks: album.total_tracks || 0,
              images: album.images?.map(img => {
                const image: Image = {
                  width: img.width || 0,
                  height: img.height || 0,
                  url: img.url || ''
                };
                return image;
              }) || [],
              href: album.href || '',
              tracks: []
            };
          });
          console.log('✨ Resultados de álbumes procesados');
          return albumResults;
        }

        console.log('⚠️ No se encontraron resultados');
        return [];
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la búsqueda:', error);

    let errorMessage = 'Ocurrió un error en la búsqueda. ';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente (red, etc)
      console.error('Error del cliente:', error.error.message);
      errorMessage += 'Por favor, verifica tu conexión a internet.';
    } else {
      // Error del servidor
      console.error(
        `El servidor respondió con código ${error.status}, ` +
        `mensaje: ${error.error?.message || error.message}`
      );

      switch (error.status) {
        case 401:
          errorMessage += 'No estás autorizado. Por favor, inicia sesión nuevamente.';
          break;
        case 403:
          errorMessage += 'No tienes permiso para realizar esta búsqueda.';
          break;
        case 429:
          errorMessage += 'Demasiadas peticiones. Por favor, espera un momento.';
          break;
        case 500:
          errorMessage += 'Error en el servidor de Spotify. Intenta más tarde.';
          break;
        default:
          errorMessage += 'Por favor, intenta de nuevo más tarde.';
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}