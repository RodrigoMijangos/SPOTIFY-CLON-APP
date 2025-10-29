import { Component, OnInit } from '@angular/core';
import { SpotifyLoginService } from '../services/general/spotify-login-service';
import { SpotifyAlbumService } from '../services/general/spotify-album-service';
import { PlayerService } from '../services/general/player-service';
import { CookiesStorageService } from '../services/cookie-storage-service';
import { Album } from '../interfaces/album';
import { Track } from '../interfaces/track';

@Component({
  selector: 'app-player',
  standalone : false,
  templateUrl: './player.html',
  styleUrl: './player.css'
})
export class Player {
  
}