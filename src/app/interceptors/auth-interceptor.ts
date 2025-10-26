import { HttpInterceptorFn } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { CookiesStorageService } from '../services/cookie-storage-service';
import { inject } from '@angular/core'
import { tap } from 'rxjs'

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const _cookieService: CookiesStorageService = inject(CookiesStorageService);
  const TOKEN_URL = 'accounts.spotify.com/api/token'; // ✅ Cambié esto

  return next(req).pipe(
    tap(
      event => {
        
        // ✅ Si NO es la URL del token, no hagas nada
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

        const expireTimeMS = 60 * 60 * 1000;
        const expireDate = new Date(Date.now() + expireTimeMS);

        _cookieService.setCookie('access_token', body.access_token, expireDate);
        
        if (body.refresh_token) {
          _cookieService.setCookie('refresh_token', body.refresh_token, expireDate);
        }
      }
    )
  );
};