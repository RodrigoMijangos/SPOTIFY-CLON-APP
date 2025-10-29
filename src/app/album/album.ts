import { Component, input } from '@angular/core';
import { Song } from '../interfaces/song';

@Component({
  selector: 'app-album',
  standalone: false,
  templateUrl: './album.html',
  styleUrl: './album.css'
})
export class Album {
  album = input.required<Song[]>();
}
