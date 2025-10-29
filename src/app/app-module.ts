import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { Player } from './player/player';
import { Navbar } from './navbar/navbar';
import { Album } from './album/album';
import { SongInfo } from './song-info/song-info';
import { AudioController} from './audio-controller/audio-controller';
import { Search } from './search/search';

// INTERCEPTORS
import { authInterceptor } from './interceptors/auth-interceptor';
import { addAuthLeaderInterceptor } from './interceptors/add-auth-leader-interceptor';
import { PlayerRoutingModule } from './player/player-routing/player-routing-module';

@NgModule({
  declarations: [
    App,
    Player,
    Navbar,
    Album,
    SongInfo,
    AudioController,
    Search,
    PlayerRoutingModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, addAuthLeaderInterceptor])
    )
  ],
  bootstrap: [App]
})
export class AppModule { }