import { Component, OnInit, signal } from '@angular/core';
import { LoginService } from './services/spotify-api/login-service';
import { PlaylistResponse } from './interfaces/album';
import { PlaylistService } from './services/spotify-api/playlist-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('EXAMPLE_APP');

  constructor(
    private _s_LoginService: LoginService,
    private _s_PlaylistService: PlaylistService
  ) {  }

  token: string = "";
  playlist: undefined | PlaylistResponse

  ngOnInit(): void {
    this._s_LoginService.getAccessToken().subscribe();
      }

  doPetition(){
    
  }
}