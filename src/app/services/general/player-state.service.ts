import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Album } from '../../interfaces/album';
import { Track } from '../../interfaces/track';
import { Image } from '../../interfaces/image';
import { SpotifyAlbumService } from './spotify-album-service';

@Injectable({ providedIn: 'root' })
export class PlayerStateService {

  //mantener cambios actuales y notificar cambios a view. Behaviour es para mantener estados.
  private randomAlbumsSub = new BehaviorSubject<Album[]>([]);
  randomAlbums$: Observable<Album[]> = this.randomAlbumsSub.asObservable(); //los componentes se actualizan automáticamente

  private currentAlbumSub = new BehaviorSubject<Album | undefined>(undefined);
  currentAlbum$ = this.currentAlbumSub.asObservable();

  private currentSongSub = new BehaviorSubject<Track | undefined>(undefined);
  currentSong$ = this.currentSongSub.asObservable();

  private currentCoverSub = new BehaviorSubject<Image | undefined>(undefined);
  currentCover$ = this.currentCoverSub.asObservable();

  private playlistSub = new BehaviorSubject<Track[]>([]);
  playlist$ = this.playlistSub.asObservable();

  constructor(private spotify: SpotifyAlbumService) { }

  loadRandomAlbums(count = 12) {
    this.spotify.getRandomAlbums(count).subscribe({
      next: (albums) => this.randomAlbumsSub.next(albums),
      error: (err) => console.error('No se pudo cargar los albumes', err)
    });
  }

  selectAlbum(album: Album) {
    //si hay canciones ponlas
    if (album.tracks && album.tracks.length > 0) {
      this.setCurrentAlbum(album);
    } else {
      this.spotify.getAlbum(album.id).subscribe({
        next: (full) => this.setCurrentAlbum(full),
        error: (err) => console.error('Error cargando el track', err)
      });
    }
  }

  private setCurrentAlbum(album: Album) { 
    this.currentAlbumSub.next(album);
    if (album.tracks && album.tracks.length > 0) {
      this.currentSongSub.next(album.tracks[0]);
      this.playlistSub.next(album.tracks);
    } else {
      this.currentSongSub.next(undefined);
      this.playlistSub.next([]);
    }
    this.currentCoverSub.next(album.images?.[0]);
  }

}
