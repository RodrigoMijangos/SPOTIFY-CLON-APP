import { Component, Input } from '@angular/core';
import { Track } from 'src/app/interfaces/track';
import { Image } from 'src/app/interfaces/image';

@Component({
  selector: 'app-playlist',
  standalone: false,
  templateUrl: './playlist.html',
  styleUrl: './playlist.css'
})
export class Playlist {

  @Input() playlist: Track[] = []; // Recibe la lista de canciones del álbum
  @Input() cover: Image | undefined; 

  onSongSelect(song: Track): void {
    console.log('Reproduciendo canción:', song.name);
  }

}
