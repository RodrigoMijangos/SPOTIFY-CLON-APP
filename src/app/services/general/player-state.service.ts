import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Album } from '../../interfaces/album';
import { Track } from '../../interfaces/track';
import { Image } from '../../interfaces/image';
import { SpotifyAlbumService } from './spotify-album-service';

@Injectable({ providedIn: 'root' })
export class PlayerStateService {
  private randomAlbumsSub = new BehaviorSubject<Album[]>([]);
  randomAlbums$: Observable<Album[]> = this.randomAlbumsSub.asObservable();

  private currentAlbumSub = new BehaviorSubject<Album | undefined>(undefined);
  currentAlbum$ = this.currentAlbumSub.asObservable();

  private currentSongSub = new BehaviorSubject<Track | undefined>(undefined);
  currentSong$ = this.currentSongSub.asObservable();

  private currentCoverSub = new BehaviorSubject<Image | undefined>(undefined);
  currentCover$ = this.currentCoverSub.asObservable();

  private playlistSub = new BehaviorSubject<Track[]>([]);
  playlist$ = this.playlistSub.asObservable();

  constructor(private spotify: SpotifyAlbumService) {}

  loadRandomAlbums(count = 12) {
    this.spotify.getRandomAlbums(count).subscribe({
      next: (albums) => this.randomAlbumsSub.next(albums),
      error: (err) => console.error('Error loading random albums', err)
    });
  }

  selectAlbum(album: Album) {
    // If album already has tracks, use it. Otherwise fetch album with tracks.
    if (album.tracks && album.tracks.length > 0) {
      this.setCurrentAlbum(album);
    } else {
      this.spotify.getAlbum(album.id).subscribe({
        next: (full) => this.setCurrentAlbum(full),
        error: (err) => console.error('Error loading album tracks', err)
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
