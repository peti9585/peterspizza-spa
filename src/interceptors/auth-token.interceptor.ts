import { HttpInterceptorFn } from '@angular/common/http';
import {AuthenticationService} from '../services/authentication.service';
import {inject} from '@angular/core';
import {catchError, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const toasterService = inject(ToastrService);

  const token = authService.getToken();

  if (token) {
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(newReq).pipe(
      catchError(error => {
        if (error.status === 401){
          authService.logout();
        }

        router.navigate(['/login']);
        toasterService.info('A munkamenet lejárt, kérlek jelentkezz be újra', 'Figyelem!');
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
