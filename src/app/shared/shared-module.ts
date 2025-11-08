import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongInfo } from './components/song-info/song-info';
import { SearchBar } from './components/search-bar/search-bar';
import { AudioController } from './components/audio-controller/audio-controller';
import { Playlist } from './components/playlist/playlist';
import { Album } from './components/album/album';


@NgModule({
  declarations: [
    SongInfo,
    AudioController,
    Album,
    Playlist,
    SearchBar
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SongInfo,
    AudioController,
    Album,
    Playlist,
    SearchBar
  ]
})
export class SharedModule { }
