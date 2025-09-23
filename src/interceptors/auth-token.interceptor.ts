import { HttpInterceptorFn } from '@angular/common/http';
import {AuthenticationService} from '../services/authentication.service';
import {inject} from '@angular/core';
import {catchError, switchMap, throwError} from 'rxjs';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const jwtToken = authService.getJwtToken();

  if (jwtToken) {
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`
      }
    });

    return next(newReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          return authService.refreshTokens().pipe(
            switchMap((response) => {
              const newReqWithNewJwt = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.jwtToken}`
                }
              });
              return next(newReqWithNewJwt);
            }),
            catchError((refreshError) => {
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
