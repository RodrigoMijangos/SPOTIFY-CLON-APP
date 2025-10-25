import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core'
import { CookiesStorageService } from '../services/cookie-storage-service';

// manejo del 401, adjuntar cada cookie al interceptor
export const addAuthLeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookiesStorageService);
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


