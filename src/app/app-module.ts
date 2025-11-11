import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AlbumDetail } from './pages/album-detail/album-detail';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { SongInfo } from './song-info/song-info';
import { AudioController } from './audio-controller/audio-controller';
import { Playlist } from './playlist/playlist';
import { Player } from './player/player';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { authInterceptor } from './interceptors/auth-interceptor';
import { addAuthHeaderInterceptor } from './interceptors/core/add-auth-header-interceptor';
import { SpotifyLoginService } from './services/spotify-api/spotify-login-service';     
import { CookiesStorageService } from './services/general/cookies-storage-service'; 

@NgModule({
  declarations: [
    App,
    SongInfo,
    AudioController,
    Playlist,
    Player,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,   
    RouterModule,
    AlbumDetail
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        addAuthHeaderInterceptor
      ])
    ),
    CookieService,
    SpotifyLoginService,
    CookiesStorageService   
  ],
  bootstrap: [App]
})
export class AppModule { }