import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { CookiesStorageService } from '../services/general/cookies-storage-service';
import { isTokenResponse } from '../core/guards/spotify-api/is-token-response';
import { environment } from '../../environments/environment.development';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {

  const _cookieService = inject(CookiesStorageService);
  
  // Si es una petición a la API de Spotify (no de autenticación), agregar el token
  if(req.url.includes(environment.API_URL) && !req.url.includes(environment.AUTH_API_URL)) {
    const token = _cookieService.getKeyValue('access_token');
    if(token) {
      req = req.clone({
        headers: req.headers.append('Authorization', `Bearer ${token}`)
      });
    }
  }

  return next(req).pipe(
    tap(event => {
      if(!req.url.includes(environment.AUTH_API_URL))
        return;
      if(event instanceof HttpResponse && event.status === 200){
        const body = event.body as any;

        if(isTokenResponse(body)){
          console.log('🎵 Token interceptado:', body);
          const expirationMS = (body.expires_in || 3600) * 1000; // usa el tiempo real o 1 hora por defecto
          const expirationDate = new Date(Date.now() + expirationMS);
          console.log('⏰ Token expira:', expirationDate);

          _cookieService.setKey('access_token', body.access_token, expirationDate);
        }
      }
    })
  );
};
