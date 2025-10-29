import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from './player';
import { Album } from './components/album/album';
import { SearchResults } from './components/search-results/search-results';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes =[
  {
    path: '',
    component: Player,
    children: [
      {path: '', component: Album},
      {path: '',component: SearchResults}
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PlayerRoutingModule { 

}
