import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookiesStorageService } from '../services/cookie-storage-service';

export const addAuthLeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookiesStorageService);
  
  if (req.url.includes('accounts.spotify.com/api/token')) {
    console.log('⏭️ Saltando interceptor para:', req.url);
    return next(req);
  }

  const token = cookieService.getCookie('spotify_access_token');

  if (!token) {
    console.log('⚠️ No hay token disponible para agregar');
    return next(req);
  }

  console.log('🔑 Agregando token a la petición:', req.url);

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedRequest);
};