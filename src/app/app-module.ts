import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { SongInfo } from './song-info/song-info';
import { AudioController } from './audio-controller/audio-controller';
import { Playlist } from './playlist/playlist';
import { Player } from './player/player';
import { SearchComponent } from './search/search';
import { MusicBarComponent } from './music-bar/music-bar.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { authInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [App, SongInfo, AudioController, Playlist, Player, SearchComponent, MusicBarComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(), provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor])), CookieService
  ],
  bootstrap: [App]
})
export class AppModule { }
