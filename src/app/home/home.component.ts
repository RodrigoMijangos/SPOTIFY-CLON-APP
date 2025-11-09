import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <div class="welcome-section">
        <h1>Bienvenido a Spotify Clone</h1>
        <p>Descubre música, artistas y podcasts</p>
        <a routerLink="/search" class="cta-button">
          <i class="fa-solid fa-magnifying-glass"></i>
          Buscar música
        </a>
      </div>
      
      <div class="featured-section">
        <h2>Géneros populares</h2>
        <div class="genres-grid">
          <div class="genre-card" style="background: linear-gradient(135deg, #ff6b6b, #ee5a24);">
            <span>Pop</span>
          </div>
          <div class="genre-card" style="background: linear-gradient(135deg, #4ecdc4, #44bd87);">
            <span>Rock</span>
          </div>
          <div class="genre-card" style="background: linear-gradient(135deg, #a8e6cf, #88cc80);">
            <span>Hip Hop</span>
          </div>
          <div class="genre-card" style="background: linear-gradient(135deg, #ffd93d, #f39c12);">
            <span>Jazz</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container { padding: 24px; color: white; background: #121212; min-height: 100vh; }
    .welcome-section { text-align: center; padding: 60px 0; }
    .welcome-section h1 { font-size: 48px; font-weight: 700; margin-bottom: 16px; }
    .welcome-section p { font-size: 18px; color: #b3b3b3; margin-bottom: 32px; }
    .cta-button { display: inline-flex; align-items: center; gap: 8px; background: #1db954; color: white; padding: 12px 24px; border-radius: 500px; text-decoration: none; font-weight: 600; transition: all 0.2s ease; }
    .cta-button:hover { background: #1ed760; transform: scale(1.05); }
    .featured-section h2 { font-size: 24px; margin-bottom: 16px; }
    .genres-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .genre-card { aspect-ratio: 1; border-radius: 8px; display: flex; align-items: end; padding: 20px; cursor: pointer; transition: transform 0.2s ease; }
    .genre-card:hover { transform: scale(1.02); }
    .genre-card span { font-size: 24px; font-weight: 700; color: white; }
  `],
  standalone: false
})
export class HomeComponent {}