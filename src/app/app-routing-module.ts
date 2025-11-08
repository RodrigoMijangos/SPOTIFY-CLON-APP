import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Player } from './pages/player/player';
import { Views } from './views/views';
import { SearchResults } from './pages/search-results/search-results';

const routes: Routes = [
  {
    path: '',
    component: Views,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: Player
      },
      {
        path: 'search-results',
        component: SearchResults
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
