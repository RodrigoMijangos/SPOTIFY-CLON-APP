import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeChild } from './home-child/home-child';
import { StaticContainer } from './static-container/static-container';
import { FirstChild } from './first-child/first-child';
import { SecondChild } from './second-child/second-child';


@NgModule({
  declarations: [
    HomeChild,
    StaticContainer,
    FirstChild,
    SecondChild
  ],
  imports: [
    CommonModule
]
})
export class SecondaryModule { }
