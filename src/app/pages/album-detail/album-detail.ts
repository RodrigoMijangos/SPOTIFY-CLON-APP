import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyAlbumService } from '../../services/spotify-api/spotify-album-service';
import { AudioService } from '../../services/audio';
import { Observable, map } from 'rxjs';
import { Album } from '../../interfaces/album';
import { Track } from '../../interfaces/track';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-album-detail',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './album-detail.html',
  styleUrl: './album-detail.css'
})
export class AlbumDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private albumService = inject(SpotifyAlbumService);
  private audioService = inject(AudioService);

  public album$!: Observable<Album>;

  ngOnInit(): void {
    const albumId = this.route.snapshot.paramMap.get('id');

    if (albumId) {
      this.album$ = this.albumService.getAlbum(albumId).pipe(
        map(album => ({
          ...album,
          tracks: album.tracks.filter(track => track.preview_url)
        }))
      );
    }
  }

  playTrack(track: Track) {
    console.log('Reproduciendo:', track.name);
    this.audioService.playSong(track);
  }
}