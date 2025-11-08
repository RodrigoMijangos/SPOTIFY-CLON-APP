import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { authInterceptor } from './interceptors/auth-interceptor';
import { addAuthLeaderInterceptor } from './interceptors/add-auth-leader-interceptor';
import { Player } from './pages/player/player';
import { SharedModule } from './shared/shared-module';
import { SearchResults } from './pages/search-results/search-results';
import { Views } from './views/views';

@NgModule({
  declarations: [
    App,
    Player,
    SearchResults,
    Views
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, addAuthLeaderInterceptor])
    )
  ],
  bootstrap: [App]
})
export class AppModule { }