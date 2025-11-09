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
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { authInterceptor } from './interceptors/auth-interceptor';
import { addAuthHeaderInterceptor } from './interceptors/core/add-auth-header-interceptor';

@NgModule({
  declarations: [App, SongInfo, AudioController, Playlist, Player, SearchComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(), provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor, addAuthHeaderInterceptor])), CookieService
  ],
  bootstrap: [App]
})
export class AppModule { }
