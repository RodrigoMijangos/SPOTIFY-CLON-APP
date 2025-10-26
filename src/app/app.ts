import { Component, OnInit, signal } from '@angular/core';
import { LoginService } from './services/spotify-api/login-service';
import { Album } from './interfaces/album';
import { PlaylistService } from './services/spotify-api/playlist-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('EXAMPLE_APP');

  constructor(
    private _s_LoginService: LoginService,
    private _s_PlaylistService: PlaylistService
  ) { }

  token: string = "";
  playlist: undefined | Album;

  ngOnInit(): void {
    this._s_LoginService.getAccessToken().subscribe({
      next: (response) => {
        console.log('✅ Token obtenido exitosamente:', response);
        this.token = response.access_token;
      },
      error: (error) => {
        console.error('❌ Error completo:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Message:', error.message);
        console.error('❌ Error body:', error.error);
      }
    });
  }
}