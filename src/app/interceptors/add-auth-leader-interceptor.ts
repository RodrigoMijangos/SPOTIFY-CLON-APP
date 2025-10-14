import { HttpInterceptorFn } from '@angular/common/http';

export const addAuthLeaderInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
