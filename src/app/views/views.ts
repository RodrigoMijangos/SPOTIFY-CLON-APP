import { Component, OnInit, signal } from '@angular/core';
import { PlayerStateService } from '../services/general/player-state.service';
import { Album } from '../interfaces/album';
import { Track } from '../interfaces/track';
import { Image } from '../interfaces/image';

@Component({
  selector: 'app-views',
  standalone: false,
  templateUrl: './views.html',
  styleUrl: './views.css'
})
export class Views implements OnInit{

  // señales locales; las alimentamos desde los observables del servicio de app
  randomAlbums = signal<Album[]>([]);
  currentAlbum = signal<Album | undefined>(undefined);
  currentSong = signal<Track | undefined>(undefined);
  currentCover = signal<Image | undefined>(undefined);
  playlist = signal<Track[]>([]);

  constructor(private playerState: PlayerStateService) {
  }

  ngOnInit(): void {
    this.playerState.loadRandomAlbums(12); //servicio es el que carga los albumes

    // suscribimos las señales locales a los observables del servicio son los que vienen de allá
    this.playerState.randomAlbums$.subscribe(a => this.randomAlbums.set(a));
    this.playerState.currentAlbum$.subscribe(a => this.currentAlbum.set(a));
    this.playerState.currentSong$.subscribe(s => this.currentSong.set(s));
    this.playerState.currentCover$.subscribe(c => this.currentCover.set(c));
    this.playerState.playlist$.subscribe(p => this.playlist.set(p));
  }

  onAlbumSelected(selected: Album) {
    this.playerState.selectAlbum(selected);
  }

}
