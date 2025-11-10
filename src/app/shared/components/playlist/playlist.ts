import { Component, Input } from '@angular/core';
import { Track } from 'src/app/interfaces/track';

@Component({
  selector: 'app-playlist',
  standalone: false,
  templateUrl: './playlist.html',
  styleUrl: './playlist.css'
})
export class Playlist {

  @Input() playlist: Track[] = []; // Recibe la lista de canciones del álbum

  onSongSelect(song: Track): void {
    console.log('Reproduciendo canción:', song.name);
  }
}
