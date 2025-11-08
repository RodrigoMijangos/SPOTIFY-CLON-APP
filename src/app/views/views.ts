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

  // Señales locales; las alimentamos desde los observables del servicio
  randomAlbums = signal<Album[]>([]);
  currentAlbum = signal<Album | undefined>(undefined);
  currentSong = signal<Track | undefined>(undefined);
  currentCover = signal<Image | undefined>(undefined);
  playlist = signal<Track[]>([]);

  constructor(private playerState: PlayerStateService) {}

  ngOnInit(): void {
    // Views es responsable de cargar los álbumes aleatorios al iniciar la vista
    this.playerState.loadRandomAlbums(12);

    // Suscribimos las señales locales a los observables del servicio.
    // Usamos suscripciones simples porque `toSignal` no está disponible
    // en la versión objetivo de este proyecto.
    this.playerState.randomAlbums$.subscribe(a => this.randomAlbums.set(a));
    this.playerState.currentAlbum$.subscribe(a => this.currentAlbum.set(a));
    this.playerState.currentSong$.subscribe(s => this.currentSong.set(s));
    this.playerState.currentCover$.subscribe(c => this.currentCover.set(c));
    this.playerState.playlist$.subscribe(p => this.playlist.set(p));
  }

  // Método que será llamado por el componente hijo (Player) cuando se
  // seleccione un álbum. Delegamos en el servicio para mantener la
  // lógica de estado centralizada.
  onAlbumSelected(selected: Album) {
    this.playerState.selectAlbum(selected);
  }

}
