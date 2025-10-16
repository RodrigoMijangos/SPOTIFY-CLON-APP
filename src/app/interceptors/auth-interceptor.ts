import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { CookiesStorageService } from '../services/general/cookies-storage-service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {

  const _cookieService = inject(CookiesStorageService);

  return next(req).pipe(
    tap(event => {
      if(!req.url.includes('api/token'))
        return event;
      if(event instanceof HttpResponse && event.status === 200){
        const body = event.body as any;

        if(body && body.access_token){
          const expirationMS = 60*60*1000;
          const expirationDate = new Date(Date.now() + expirationMS)

          _cookieService.setKey('access_token', body.access_token, expirationDate);
        }
      }
      return event;
    })
  );
};
