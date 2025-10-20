import { HttpInterceptorFn } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { CookieStorageService } from '../services/cookie-storage-service';
import {inject} from '@angular/core'
import { tap} from 'rxjs'

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const _cookieService: CookieStorageService = inject (CookieStorageService) //inyectar servicios desde la capa principal
  const TOKEN_URL = '/api/token';

  //modificar la respuesta
  return next(req).pipe(
    tap(
      event => {
        
        if(!req.url.includes(TOKEN_URL))
          return next(req);

        if(event.type !== HttpEventType.Response || !event.body){
            return  next(req);// si hay una respuesta cachala 
        }

        const body = event.body as any; //no se que hay pero castealo como ese any y ya me ahorro saber que tipo de dato viene

        if(!body || !body.access_token){
            return next(req);
        }    

        const expireTimeMS = 60*60*1000;
        const expireDate = new Date(Date.now()+expireTimeMS);

        _cookieService.setCookie('access_token', body.access_token, expireDate) 
        
        if(body.refresh_token){
          _cookieService.setCookie('refresh_token', body.refresh_token)
        }// rastrear TODO
      
        return event; // siempre hay q retornar algo usando ek event poipiip
      })
  );
};
