import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongInfo } from './song-info/song-info';

const routes: Routes = [
  {
    path: '',
    component: SongInfo,
    title: 'Player'
  },
  {
    path: 'player/search', // a donde
    component: SongDisplay,
    children: 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
