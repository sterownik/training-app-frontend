import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((event) => {
      // if (event.type === HttpEventType.Response) {
      console.log(event);
      if (event.status === 403) {
        localStorage.removeItem('token');
        router.navigate(['/welcome']);
      }

      return of();
      // }
    })
  );
};
