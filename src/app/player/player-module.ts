import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from './player';
import { SearchBar } from '../search-bar/search-bar';
import { AudioController } from '../audio-controller/audio-controller';
import { Album } from '../album/album';
import { SongInfo } from './components/song-info/song-info';
import { SearchResults } from '../../search-results/search-results';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    Player,
    SearchBar,
    AudioController,
    Album,
    SongInfo,
    SearchResults
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class PlayerModule { }
