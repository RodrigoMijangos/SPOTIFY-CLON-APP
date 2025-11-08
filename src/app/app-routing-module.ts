import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Player } from './player/player';
import { SearchComponent } from './search/search';
import { StaticContainer } from './secondary/static-container/static-container';
import { HomeChild } from './secondary/home-child/home-child';
import { FirstChild } from './secondary/first-child/first-child';
import { SecondChild } from './secondary/second-child/second-child';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'player',
    component: Player
  },
  {
    path:'secondary',
    component: StaticContainer,
    children:[
      {
        path:'',
        component:HomeChild
      },
      {
        path:'first',
        component: FirstChild
      },
      {
        path: 'second',
        component: SecondChild
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/search'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
