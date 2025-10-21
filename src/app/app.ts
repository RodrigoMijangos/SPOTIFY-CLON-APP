import { Component, OnInit, signal } from '@angular/core';
<<<<<<< HEAD
import { LoginService } from './services/spotify-api/login-service';
import { PlaylistResponse } from './interfaces/playlist-response';
import { PlaylistService } from './services/spotify-api/playlist-service';
=======
import { SpotifyLoginService } from './services/spotify-api/spotify-login-service';
import { SpotifyAlbumService } from './services/spotify-api/spotify-album-service';
>>>>>>> origin/develop

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit{
<<<<<<< HEAD
  protected readonly title = signal('EXAMPLE_APP');

  constructor(
    private _s_LoginService: LoginService,
  ) {  }

  token: string = "";
  playlist: undefined | PlaylistResponse

  ngOnInit(): void {
    this._s_LoginService.getAccessToken().subscribe();
    };


  }




=======

  constructor(
    private _spotifyLoginService: SpotifyLoginService,
    private _spotifyAlbumService: SpotifyAlbumService
  ){}

  ngOnInit(): void {
    this._spotifyLoginService.getAccessToken().subscribe(
      (data)=> this._spotifyAlbumService.getAlbum(data.access_token)
        .subscribe(
          (album_data) => console.log(album_data)
        )
      );
    console.log("API TOKEN OBTENIDO")
  }

}
>>>>>>> origin/develop
