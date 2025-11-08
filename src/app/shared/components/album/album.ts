import { Component, input, output } from '@angular/core';
import { Album as AlbumInterface } from '../../../interfaces/album';

@Component({
  selector: 'app-album',
  standalone: false,
  templateUrl: './album.html',
  styleUrl: './album.css'
})
export class Album {
  album = input.required<AlbumInterface>();


  albumSelected = output<AlbumInterface>(); 

  onAlbumClick(): void{
    console.log('Reproduciendo:,', this.album().name);
    this.albumSelected.emit(this.album());
  }
}
