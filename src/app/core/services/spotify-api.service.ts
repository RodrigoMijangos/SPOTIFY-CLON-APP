import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SearchResult, Track } from '../models/track.model';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SpotifyApiService {

  constructor(private http: HttpClient) { }

  searchAll(query: string): Observable<SearchResult> {
    if (!query || query.length < 2) {
      return of({ tracks: [], albums: [], artists: [] });
    }

    return this.http.get<any>(`${environment.API_URL}/search`, {
      params: {
        q: query,
        type: 'track,album,artist',
        limit: '10',
        market: 'US'
      }
    }).pipe(
      map(response => {
        console.log('Respuesta cruda de Spotify:', response);
        const tracks = response.tracks?.items || [];
        const albums = response.albums?.items || [];
        const artists = response.artists?.items || [];

        console.log('Tracks encontrados:', tracks.length);

        const tracksWithPreview = tracks.filter((t: any) => t.preview_url);
        const tracksWithoutPreview = tracks.filter((t: any) => !t.preview_url);

        return {
          tracks: [...tracksWithPreview, ...tracksWithoutPreview],
          albums: albums,
          artists: artists
        };
      }),
      catchError((error) => {
        console.error('Error searching Spotify:', error);
        console.error('Detalles del error:', error.error);
        return this.getMockResults(query);
      })
    );
  }

  private getMockResults(query: string): Observable<SearchResult> {
    const mockTracks: Track[] = [
      {
        id: '1',
        name: `${query} - Canción Demo 1`,
        duration_ms: 210000,
        popularity: 85,
        artists: [{ id: '1', name: 'Artista Demo' }],
        album: {
          id: '1',
          name: 'Álbum Demo',
          images: [
            { url: 'https://via.placeholder.com/640x640/1db954/ffffff?text=Demo+1', height: 640, width: 640 },
            { url: 'https://via.placeholder.com/300x300/1db954/ffffff?text=Demo+1', height: 300, width: 300 },
            { url: 'https://via.placeholder.com/64x64/1db954/ffffff?text=D1', height: 64, width: 64 }
          ]
        },
        external_urls: { spotify: '#' }
      },
      {
        id: '2',
        name: `${query} - Canción Demo 2`,
        duration_ms: 195000,
        popularity: 78,
        artists: [{ id: '2', name: 'Otro Artista' }],
        album: {
          id: '2',
          name: 'Segundo Álbum',
          images: [
            { url: 'https://via.placeholder.com/640x640/ff6b35/ffffff?text=Demo+2', height: 640, width: 640 },
            { url: 'https://via.placeholder.com/300x300/ff6b35/ffffff?text=Demo+2', height: 300, width: 300 },
            { url: 'https://via.placeholder.com/64x64/ff6b35/ffffff?text=D2', height: 64, width: 64 }
          ]
        },
        external_urls: { spotify: '#' }
      },
      {
        id: '3',
        name: `Resultado para: ${query}`,
        duration_ms: 180000,
        popularity: 92,
        artists: [{ id: '3', name: 'Artista Popular' }],
        album: {
          id: '3',
          name: 'Hit Album',
          images: [
            { url: 'https://via.placeholder.com/640x640/9c27b0/ffffff?text=Demo+3', height: 640, width: 640 },
            { url: 'https://via.placeholder.com/300x300/9c27b0/ffffff?text=Demo+3', height: 300, width: 300 },
            { url: 'https://via.placeholder.com/64x64/9c27b0/ffffff?text=D3', height: 64, width: 64 }
          ]
        },
        external_urls: { spotify: '#' }
      }
    ];

    const mockAlbums = [
      {
        id: '1',
        name: `Álbum ${query}`,
        artists: [{ id: '1', name: 'Artista Demo' }],
        images: [{ url: 'https://via.placeholder.com/640x640/1db954/ffffff?text=Album', height: 640, width: 640 }]
      }
    ];

    const mockArtists = [
      {
        id: '1',
        name: `Artista ${query}`,
        images: [{ url: 'https://via.placeholder.com/640x640/333/ffffff?text=Artist', height: 640, width: 640 }]
      }
    ];

    return of({
      tracks: mockTracks,
      albums: mockAlbums,
      artists: mockArtists
    });
  }
}