import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core'
import { CookiesStorageService } from '../services/cookie-storage-service';

export const addAuthLeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookiesStorageService);
  
  // ✅ NO agregues el header Authorization a la petición de login de Spotify
  if (req.url.includes('accounts.spotify.com/api/token')) {
    return next(req);
  }

  const token = cookieService.getCookie('access_token');

  if (!token) {
    return next(req);
  }

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedRequest);
};