import { Component, OnInit, signal } from '@angular/core';
import { Album } from './interfaces/album';
import { SpotifyLoginService } from './services/general/spotify-login-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('EXAMPLE_APP');

  constructor(
    private _s_LoginService: SpotifyLoginService
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