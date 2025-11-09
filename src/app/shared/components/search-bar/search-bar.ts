import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {
  searchQuery = signal('');

  constructor(private router: Router) {}

  onSearch(event: Event) {
    event.preventDefault();
    if (this.searchQuery()) {
      // navega a search-results con el query como parámetro
      this.router.navigate(['/search-results'], {
        queryParams: { q: this.searchQuery() }
      });
    }
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
