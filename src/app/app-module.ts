import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { authInterceptor } from './interceptors/auth-interceptor';
import { addAuthLeaderInterceptor } from './interceptors/add-auth-leader-interceptor';

@NgModule({
  declarations: [
    App 
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