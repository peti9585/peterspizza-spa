import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {catchError, map, of, take} from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};

export const authGuardForAdmin: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (!authService.isLoggedIn) {
    router.navigate(['/admin/login']);
    return false;
  }

  return authService.isAdmin.pipe(
    take(1),
    map((response) => {
      return response.isAdmin ? true : router.parseUrl('/admin/login');
    }),
    catchError(() => {
      return of(router.parseUrl('/admin/login'));
    })
  );
}
