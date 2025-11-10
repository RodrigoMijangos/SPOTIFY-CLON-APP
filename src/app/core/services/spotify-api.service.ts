import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { SearchResult, Track } from '../models/track.model';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SpotifyApiService {
  private accessToken: string | null = null;
  
  constructor(private http: HttpClient) {}

  private getAccessToken(): Observable<string> {
    if (this.accessToken) {
      return of(this.accessToken);
    }

    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', environment.CLIENT_ID);
    body.set('client_secret', environment.CLIENT_SECRET);

    return this.http.post<any>(environment.AUTH_API_URL, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      map(response => {
        this.accessToken = response.access_token;
        return this.accessToken!;
      }),
      catchError(error => {
        console.error('Error obtaining token:', error);
        return of('');
      })
    );
  }

  searchAll(query: string): Observable<SearchResult> {
    if (!query || query.length < 2) {
      return of({ tracks: [], albums: [], artists: [] });
    }

    return this.getAccessToken().pipe(
      switchMap(token => {
        if (!token) {
          return of({ tracks: [], albums: [], artists: [] });
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<any>(`${environment.API_URL}/search`, {
          params: { 
            q: query, 
            type: 'track,album,artist', 
            limit: '10',
            market: 'US'
          },
          headers: headers
        }).pipe(
          map(response => {
            const tracks = response.tracks?.items || [];
            const albums = response.albums?.items || [];
            const artists = response.artists?.items || [];
            
            const tracksWithPreview = tracks.filter((t: any) => t.preview_url);
            const tracksWithoutPreview = tracks.filter((t: any) => !t.preview_url);
            
            return { 
              tracks: [...tracksWithPreview, ...tracksWithoutPreview],
              albums: albums,
              artists: artists
            };
          }),
          catchError(error => {
            console.error('Error en búsqueda:', error);
            if (error.status === 401) {
              this.accessToken = null;
            }
            return of({ tracks: [], albums: [], artists: [] });
          })
        );
      })
    );
  }
}