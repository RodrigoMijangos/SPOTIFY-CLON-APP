import { HttpInterceptorFn, HttpEventType } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { CookiesStorageService } from '../services/cookie-storage-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookiesStorageService);
  const TOKEN_URL = 'accounts.spotify.com/api/token';

  return next(req).pipe(
    tap(event => {
      if (!req.url.includes(TOKEN_URL)) {
        return;
      }

      if (event.type !== HttpEventType.Response || !event.body) {
        return;
      }

      const body = event.body as any;

      if (!body || !body.access_token) {
        return;
      }

      console.log('authInterceptor: Guardando token en cookies');

      const expireTimeMS = 60 * 60 * 1000;
      const expireDate = new Date(Date.now() + expireTimeMS);

      cookieService.setCookie('spotify_access_token', body.access_token, expireDate);
      
      if (body.refresh_token) {
        cookieService.setCookie('spotify_refresh_token', body.refresh_token, expireDate);
      }

      console.log('Token guardado. Expira en:', expireDate);
    })
  );
};