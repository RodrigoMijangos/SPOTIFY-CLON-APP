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
    path: '/search',
    component: SongDisplay
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
