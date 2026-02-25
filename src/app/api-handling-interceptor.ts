import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserData } from './services/user-data';

export const apiHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const userData = inject(UserData);
  const token = localStorage.getItem('token') || userData.userToken();
  if (!token) {
    return next(req);
  }
  const authReq = req.clone({
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    }),
  });
  return next(authReq);
};
