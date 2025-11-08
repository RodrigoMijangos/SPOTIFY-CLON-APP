import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { authInterceptor } from './interceptors/auth-interceptor';
import { addAuthLeaderInterceptor } from './interceptors/add-auth-leader-interceptor';
import { SongInfo } from './song-info/song-info';
import { AudioController } from './audio-controller/audio-controller';
import { Player } from './player/player';
import { Album } from './album/album';
import { SearchBar } from './search-bar/search-bar';
import { Playlist } from './playlist/playlist';

@NgModule({
  declarations: [
    App,
    SongInfo,
    AudioController,
    Player,
    Album,
    SearchBar,
    Playlist
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, addAuthLeaderInterceptor])
    )
  ],
  bootstrap: [App]
})
export class AppModule { }