import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { SongInfo } from './song-info/song-info';
import { AudioController } from './audio-controller/audio-controller';
import { Player } from './player/player';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { authInterceptor } from './interceptors/auth-interceptor';
import { addAuthLeaderInterceptor } from './interceptors/add-auth-leader-interceptor';
import { Navbar } from './navbar/navbar';
import { Album } from './album/album';

@NgModule({
  declarations: [
    App,
    SongInfo,
    AudioController,
    Player,
    Navbar,
    Album
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(
      withInterceptors([
        authInterceptor,       
        addAuthLeaderInterceptor
      ])
    ),
    CookieService,
  ],
  bootstrap: [App]
})
export class AppModule { }
