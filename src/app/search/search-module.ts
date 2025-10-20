import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBar } from './search-bar/search-bar';
import { SearchDispay } from './search-dispay/search-dispay';



@NgModule({
  declarations: [
    SearchBar,
    SearchDispay
  ],
  imports: [
    CommonModule
  ]
})
export class SearchModule { }
