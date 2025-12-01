import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookiesStorageService } from '../../services/general/cookies-storage-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookiesStorageService);
  const token = cookieService.getKeyValue('access_token');

  let request = req;

  if (token) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request);
};