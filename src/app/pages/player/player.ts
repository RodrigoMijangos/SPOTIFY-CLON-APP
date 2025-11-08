import { Component, OnInit } from '@angular/core';
import { PlayerStateService } from '../../services/general/player-state.service';
import { Album } from '../../interfaces/album';

@Component({
  selector: 'app-player',
  templateUrl: './player.html',
  standalone: false,
  styleUrl: './player.css'
})
export class Player implements OnInit {

  randomAlbums: Album[] = [];

  constructor(private playerState: PlayerStateService) {}

  ngOnInit(): void {
    // El servicio ya carga los álbumes desde Views, el componente Player
    // solo se suscribe para mostrarlos.
    this.playerState.randomAlbums$.subscribe(a => this.randomAlbums = a);
  }

  onAlbumSelected(selected: Album) {
    // Delegamos la selección al servicio centralizado
    this.playerState.selectAlbum(selected);
  }

}