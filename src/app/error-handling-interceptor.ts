import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { REFRESH_TOKEN } from './services/data/enpoints';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const http = inject(HttpClient);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const token = localStorage.getItem('token');

      // 🔴 tylko jeśli mamy token i to NIE jest refresh request
      if (error.status === 403 && token && !req.url.includes(REFRESH_TOKEN)) {
        return http.post<{ token: string }>(REFRESH_TOKEN, {}).pipe(
          switchMap((res) => {
            // ✅ zapis nowego tokena
            localStorage.setItem('token', res.token);

            // ✅ ponowienie oryginalnego requestu
            const clonedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.token}`,
              },
            });

            return next(clonedReq);
          }),
          catchError((refreshError) => {
            // 🔴 refresh nie działa → logout
            localStorage.removeItem('token');
            router.navigate(['/welcome']);
            return throwError(() => refreshError);
          }),
        );
      }

      if (error.status === 403) {
        localStorage.removeItem('token');
        router.navigate(['/welcome']);
      }

      return throwError(() => error);
    }),
  );
};
