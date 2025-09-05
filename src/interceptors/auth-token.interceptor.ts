import { HttpInterceptorFn } from '@angular/common/http';
import {AuthenticationService} from '../services/authentication.service';
import {inject} from '@angular/core';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);

  const token = authService.getToken();

  console.log('Interceptor called! ' + token);

  if (token) {
    console.log('Token found! Adding to request headers');
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(newReq);
  }

  return next(req);
};
