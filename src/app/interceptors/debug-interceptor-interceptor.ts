import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const debugInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🔍 DEBUG INTERCEPTOR');
  console.log('📤 Request URL:', req.url);
  console.log('📤 Request Method:', req.method);
  console.log('📤 Request Headers:', req.headers.keys().map(key => `${key}: ${req.headers.get(key)}`));
  console.log('📤 Request Body:', req.body);

  return next(req).pipe(
    tap({
      next: (event: any) => {
        if (event.type === 4) {
          console.log('📥 Response:', event);
        }
      },
      error: (error) => {
        console.error('❌ Error en request:', error);
      }
    })
  );
};