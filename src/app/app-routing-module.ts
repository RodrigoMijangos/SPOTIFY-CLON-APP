import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Player } from './player/player';

const routes: Routes = [

  {
    path:'',
    component: Player,
    children: [
      { path: '', redirectTo: 'albums', pathMatch: 'full' },
      { path: 'albums', loadChildren: () => import('./player/player-routing/player-routing-module').then(m => m.PlayerRoutingModule) }
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
