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

  buscar(consulta: string, tipo: string = 'track', limite: number = 20): Observable<SearchResult> {
    const parametros = new HttpParams().set('q', consulta).set('type', tipo).set('limit', limite.toString());
    return this._http.get<SpotifySearchResponse>(`${environment.API_URL}/search`, { params: parametros }).pipe(
      map(respuesta => ({ 
        tracks: respuesta.tracks?.items || [], 
        albums: respuesta.albums?.items || [], 
        artists: respuesta.artists?.items || [], 
        playlists: respuesta.playlists?.items || [] 
      }))
    );
  }

  buscarCanciones(consulta: string, limite: number = 20): Observable<any[]> { return this.buscar(consulta, 'track', limite).pipe(map(resultado => resultado.tracks)); }
  buscarAlbumes(consulta: string, limite: number = 20): Observable<any[]> { return this.buscar(consulta, 'album', limite).pipe(map(resultado => resultado.albums)); }
  buscarArtistas(consulta: string, limite: number = 20): Observable<any[]> { return this.buscar(consulta, 'artist', limite).pipe(map(resultado => resultado.artists)); }
}