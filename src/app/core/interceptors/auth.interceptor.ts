import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Simple pass-through interceptor
  // SpotifyApiService handles authentication internally
  return next(req);
};