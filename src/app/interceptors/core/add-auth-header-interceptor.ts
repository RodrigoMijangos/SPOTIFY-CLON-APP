import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { inject } from '@angular/core';
import { CookiesStorageService } from '../../services/general/cookies-storage-service';
import { SpotifyLoginService } from '../../services/spotify-api/spotify-login-service';
import { switchMap, tap } from 'rxjs';

export const addAuthHeaderInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {

  const _cookieStorage: CookiesStorageService = inject(CookiesStorageService)
  const _spotifyLogin: SpotifyLoginService = inject(SpotifyLoginService)

  // Only attach auth header to API requests
  if(!req.url.includes(environment.API_URL))
    return next(req)

  const token = _cookieStorage.getKeyValue('access_token');

  if(token){
    const newReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    })
    return next(newReq);
  }

  // If no token present, fetch one and then retry the request with the header
  return _spotifyLogin.getAccessToken().pipe(
    tap(res => {
      if(res && res.access_token){
        const expirationMS = (res.expires_in ?? 3600) * 1000;
        const expirationDate = new Date(Date.now() + expirationMS)
        _cookieStorage.setKey('access_token', res.access_token, expirationDate);
      }
    }),
    switchMap((res:any) => {
      const newReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${res.access_token}`)
      });
      return next(newReq);
    })
  );
};
