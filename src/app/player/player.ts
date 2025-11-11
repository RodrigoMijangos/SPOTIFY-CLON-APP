import { Component, OnInit, inject, signal } from '@angular/core';
import { SpotifyAlbumService } from '../services/spotify-api/spotify-album-service';
import { Album } from '../interfaces/album';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; 
import { SpotifySearchService } from '../services/spotify-api/spotify-search';
import { SpotifyArtistResponse } from '../interfaces/spotify-api/spotify-artist-response';
import { SpotifyTrackResponse } from '../interfaces/spotify-api/spotify-track-response';
import { SpotifyAlbumResponse } from '../interfaces/spotify-api/spotify-album-response';
import { AudioService } from '../services/audio';
import { Track } from '../interfaces/track'; 

@Component({
  selector: 'app-player',
  standalone: false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player implements OnInit {

  album$: Observable<Album>;

  private _spotifyAlbum = inject(SpotifyAlbumService);
  private searchService = inject(SpotifySearchService);
  private router = inject(Router); 
  private audioService = inject(AudioService); 

  public tracks = signal<SpotifyTrackResponse[]>([]);
  public artists = signal<SpotifyArtistResponse[]>([]);
  public albums = signal<SpotifyAlbumResponse[]>([]);
  public isSearching = signal(false);

  constructor() {
    this.album$ = this._spotifyAlbum.getAlbum('4aawyAB9vmqN3uQ7FjRGTy'); 
  }

  ngOnInit(): void {
  }

  buscar(query: string) {
    const trimmedQuery = query.trim();

    if (trimmedQuery === '') {
      this.isSearching.set(false);
      this.tracks.set([]);
      this.artists.set([]);
      this.albums.set([]);
      return;
    }

    this.isSearching.set(true);
    console.log(`Buscando: ${trimmedQuery}`);

    this.searchService.search(trimmedQuery).subscribe(response => {
      console.log(response);
      this.tracks.set(response.tracks.items.filter(track => track.preview_url));
      this.artists.set(response.artists.items);
      this.albums.set(response.albums.items);
    });
  }

  playTrack(track: SpotifyTrackResponse) {
    console.log('Reproduciendo:', track.name);
    this.audioService.playSong(track as Track); 
  }

  goToAlbum(id: string) {
    this.router.navigate(['/album', id]);
  }

  goToArtist(id: string) {
    console.log('Navegando al artista:', id);
  }
}