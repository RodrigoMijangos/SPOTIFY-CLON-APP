import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface SpotifySearchResponse {
  tracks: {
    items: any[];
    total: number;
    limit: number;
    offset: number;
  };
  albums: {
    items: any[];
    total: number;
    limit: number;
    offset: number;
  };
  artists: {
    items: any[];
    total: number;
    limit: number;
    offset: number;
  };
  playlists: {
    items: any[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface SearchResult {
  tracks: any[];
  albums: any[];
  artists: any[];
  playlists: any[];
}

@Injectable({
  providedIn: 'root'
})
export class SpotifySearchService {

  constructor(private _http: HttpClient) {}

  search(query: string, type: string = 'track', limit: number = 20): Observable<SearchResult> {
    const params = new HttpParams().set('q', query).set('type', type).set('limit', limit.toString()).set('market', 'US');
    return this._http.get<SpotifySearchResponse>(`${environment.API_URL}/search`, { params }).pipe(
      map(response => ({ tracks: response.tracks?.items || [], albums: response.albums?.items || [], artists: response.artists?.items || [], playlists: response.playlists?.items || [] }))
    );
  }

  searchTracks(query: string, limit: number = 20): Observable<any[]> { return this.search(query, 'track', limit).pipe(map(result => result.tracks)); }
  searchAlbums(query: string, limit: number = 20): Observable<any[]> { return this.search(query, 'album', limit).pipe(map(result => result.albums)); }
  searchArtists(query: string, limit: number = 20): Observable<any[]> { return this.search(query, 'artist', limit).pipe(map(result => result.artists)); }
  getTopTracks(): Observable<any[]> { return this.searchTracks('year:2024', 50); }
  getFeaturedPlaylists(): Observable<any[]> { return this._http.get<any>(`${environment.API_URL}/browse/featured-playlists`).pipe(map(response => response.playlists?.items || [])); }
}