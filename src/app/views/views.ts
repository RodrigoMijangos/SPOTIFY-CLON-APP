import { Component, OnInit, signal } from '@angular/core';
import { PlayerStateService } from '../services/general/player-state.service';
import { Album } from '../interfaces/album';
import { Track } from '../interfaces/track';
import { Image } from '../interfaces/image';
import { Song } from '../interfaces/song';

@Component({
  selector: 'app-views',
  standalone: false,
  templateUrl: './views.html',
  styleUrl: './views.css'
})
export class Views implements OnInit {
  // Albums y playlist
  randomAlbums = signal<Album[]>([]);
  playlist = signal<Track[]>([]);

  // Canción actual
  currentSong = signal<Track | undefined>(undefined);
  currentCover = signal<Image | undefined>(undefined);

  // Para el reproductor
  currentPlayableSong = signal<Song | undefined>(undefined);
  playablePlaylist = signal<Song[]>([]);

  constructor(private playerState: PlayerStateService) {
  }

  ngOnInit(): void {
    // cargar albums aleatorios
    this.playerState.loadRandomAlbums(12);

    // actualizar albums
    this.playerState.randomAlbums$.subscribe(albums => {
      this.randomAlbums.set(albums);
    });

    // actualizar canción y playlist
    this.playerState.currentSong$.subscribe(song => {
      this.currentSong.set(song);
      if (song && this.currentCover()) {
        // convertir a formato reproducible
        const playableSong = {
          name: song.name,
          artist: song.artists[0]?.name || 'Desconocido',
          url: song.preview_url || '',
          cover: this.currentCover()?.url || ''
        };
        this.currentPlayableSong.set(playableSong);
      }
    });

    // actualizar portada
    this.playerState.currentCover$.subscribe(cover => {
      this.currentCover.set(cover);
    });

    // actualizar playlist
    this.playerState.playlist$.subscribe(tracks => {
      this.playlist.set(tracks);
      // convertir canciones a formato reproducible
      const playableSongs = tracks.map(track => ({
        name: track.name,
        artist: track.artists[0]?.name || 'Desconocido',
        url: track.preview_url || '',
        cover: this.currentCover()?.url || ''
      }));
      this.playablePlaylist.set(playableSongs);
    });
  }

  onAlbumSelected(album: Album) {
    this.playerState.selectAlbum(album);
  }

}
