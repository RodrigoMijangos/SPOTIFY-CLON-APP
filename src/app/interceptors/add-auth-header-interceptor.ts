import { HttpInterceptorFn } from '@angular/common/http';

export const addAuthHeaderInterceptor: HttpInterceptorFn = (req, next) => {



  return next(req);
};
