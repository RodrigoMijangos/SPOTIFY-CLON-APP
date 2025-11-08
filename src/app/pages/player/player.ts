import { Component, OnInit } from '@angular/core';
import { SpotifyAlbumService } from '../../services/general/spotify-album-service';
import { Observable } from 'rxjs';
import { Album } from '../../interfaces/album';
import { Track } from '../../interfaces/track';
import { Image } from '../../interfaces/image';

@Component({
  selector: 'app-player',
  templateUrl: './player.html',
  standalone: false,
  styleUrl: './player.css'
})
export class Player implements OnInit {


  album: Album | undefined;
  randomAlbums: Album[] = [];

  currentSong: Track | undefined;
  currentCover: Image | undefined;
  playlist: Track[] = [];

  constructor(private _spotifyAlbum: SpotifyAlbumService) {
  }

  ngOnInit(): void {
    this.loadRandomAlbums(); 
  }


  loadRandomAlbums(): void {
    this._spotifyAlbum.getRandomAlbums(12).subscribe({
      next: (albums) => {
        this.randomAlbums = albums;
        console.log('12 álbumes aleatorios cargados:', albums);
      },
      error: (err) => console.error('Error álbumes:', err)
    });
  }

  onAlbumSelected(selectedAlbum: Album) {
    console.log('Album reproduciendo:', selectedAlbum.name);

    if (!selectedAlbum.tracks || selectedAlbum.tracks.length === 0) {
      this.loadALbumWithTracks(selectedAlbum.id);
    } else {
      this.album = selectedAlbum;
      this.updateCurrentSong(selectedAlbum);
    }
  }

  loadALbumWithTracks(albumId: string) {
    this._spotifyAlbum.getAlbum(albumId).subscribe({
      next: (album) => {
        this.album = album;
        this.updateCurrentSong(album);
        console.log('Album cargado:', album.name)
      },
      error: (err) => console.log('Error al cargar', err)
    })
  }

  updateCurrentSong(album: Album){
    if (album.tracks && album.tracks.length > 0){
      this.currentSong = album.tracks[0];
      this.currentCover = album.images[0];
      this.playlist = album.tracks;

      console.log('Cancion reproduciendose', this.currentSong)
    }
  }

}