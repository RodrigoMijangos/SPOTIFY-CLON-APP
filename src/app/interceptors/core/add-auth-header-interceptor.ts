import { HttpInterceptorFn} from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { inject } from '@angular/core';
import { CookiesStorageService } from '../../services/general/cookies-storage-service';

export const addAuthHeaderInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const almacenamientoCookies: CookiesStorageService = inject(CookiesStorageService)
  if(!peticion.url.includes(environment.API_URL)) return siguiente(peticion)
  const token = almacenamientoCookies.getKeyValue('access_token');
  const nuevaPeticion = peticion.clone({ headers: peticion.headers.append('Authorization', `Bearer ${token}`) })
  return siguiente(nuevaPeticion);
};
