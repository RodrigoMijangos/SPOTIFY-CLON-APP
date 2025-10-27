import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Track } from '../../interfaces/track';

interface SpotifySearchResponse {
  tracks: {
    items: Array<{
      id: string;
      name: string;
      duration_ms: number;
      href: string;
      artists: Array<{
        id: string;
        name: string;
        href: string;
      }>;
      album: {
        images: Array<{
          url: string;
          width: number;
          height: number;
        }>;
      };
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SpotifySearchService {

  constructor(private _http: HttpClient) {}

  searchTracks(query: string, limit: number = 10): Observable<Track[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'track')
      .set('limit', limit.toString());

    return this._http.get<SpotifySearchResponse>(
      `${environment.API_URL}/search`,
      { params }
    ).pipe(
      map(response => 
        response.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          duration_ms: track.duration_ms,
          href: track.href,
          artists: track.artists.map(artist => ({
            id: artist.id,
            name: artist.name
          })),
          cover: track.album.images[0]?.url || ''
        }))
      )
    );
  }

  getRandomTrack(): Observable<Track> {
    // Lista de caracteres random para buscar
    const randomChars = 'abcdefghijklmnopqrstuvwxyz';
    const randomChar = randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    const randomOffset = Math.floor(Math.random() * 100);

    const params = new HttpParams()
      .set('q', randomChar)
      .set('type', 'track')
      .set('limit', '50')
      .set('offset', randomOffset.toString());

    return this._http.get<SpotifySearchResponse>(
      `${environment.API_URL}/search`,
      { params }
    ).pipe(
      map(response => {
        const tracks = response.tracks.items;
        const randomIndex = Math.floor(Math.random() * tracks.length);
        const track = tracks[randomIndex];
        
        return {
          id: track.id,
          name: track.name,
          duration_ms: track.duration_ms,
          href: track.href,
          artists: track.artists.map(artist => ({
            id: artist.id,
            name: artist.name
          })),
          cover: track.album.images[0]?.url || ''
        };
      })
    );
  }
}