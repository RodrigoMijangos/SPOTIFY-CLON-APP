import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpotifyAlbumResponse } from '../../interfaces/spotify-api/spotify-album-response';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Album } from '../../interfaces/album';
import { Track } from '../../interfaces/track';
import { Image } from '../../interfaces/image';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAlbumService {

  private env = environment;

  constructor(
    private _http: HttpClient
  ) {}

  getAlbum(id: string): Observable<Album> {
    console.log('Cargango album:', id)
    return this._http.get<SpotifyAlbumResponse>(
      `${environment.API_URL}/albums/${id}`
    ).pipe(
      map(apiresponse => {

        const mappedTracks: Track[] = apiresponse.tracks.items.map(
          track => ({
            id: track.id,
            name: track.name,
            duration_ms: track.duration_ms,
            href: track.href,
            preview_url: track.preview_url,
            artists: track.artists.map(artist => ({
              id: artist.id,
              name: artist.name
            }))
          })
        );

        const mappedImages: Image[] = apiresponse.images.map(
          image => ({
            width: image.width,
            height: image.height,
            url: image.url
          })
        );

        return {
          id: apiresponse.id,
          name: apiresponse.name,
          total_tracks: apiresponse.total_tracks,
          images: mappedImages,
          href: apiresponse.href,
          tracks: mappedTracks,
        }
      })
    )
  }

  getRandomAlbums(count: number = 12): Observable<Album[]> {
    const genres = ['pop', 'rock', 'jazz', 'electronic', 'hip-hop', 'indie', 'latin', 'r&b'];
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    const randomOffset = Math.floor(Math.random() * 100);

    return this._http.get<any>(
      `${environment.API_URL}/search?q=genre:${randomGenre}&type=album&limit=${count}&offset=${randomOffset}`
    ).pipe(
      map(response => {
        return response.albums.items.map((album: any) => ({
          id: album.id,
          name: album.name,
          total_tracks: album.total_tracks,
          images: album.images.map((img: any) => ({
            width: img.width,
            height: img.height,
            url: img.url
          })),
          href: album.href,
          artists: album.artists,
          tracks: []
        }));
      })
    );
  }
}