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

  private searchService = inject(SpotifySearchService);
  public tracks = signal<SpotifyTrackResponse[]>([]);
  public artists = signal<SpotifyArtistResponse[]>([]);
  public albums = signal<SpotifyAlbumResponse[]>([]);


  buscar(query: string) {
    if (query.trim() === '') {
      this.tracks.set([]);
      this.artists.set([]);
      this.albums.set([]);
      return;
    }

    console.log(`Buscando: ${query}`);

    this.searchService.search(query).subscribe(response => {
      console.log(response);
      this.tracks.set(response.tracks.items);
      this.artists.set(response.artists.items);
      this.albums.set(response.albums.items);
    });
  }
}