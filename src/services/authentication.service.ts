import {inject, Injectable} from '@angular/core';
import {ILoginData, ILoginResponse, IRefreshJwtTokenRequest, IRegistrationData, ITokenResponse} from '../interfaces/interfaces-global';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly baseUrl = 'http://localhost:5104/api/user';

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toasterService = inject(ToastrService);

  submitRegistration(registrationData: IRegistrationData) {
    return this.http.post(this.baseUrl + '/register', registrationData);
  }

  submitLogin(loginData: ILoginData): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(this.baseUrl + '/login', loginData)
      .pipe(tap(resp => {
        if (resp.name.length > 0 && resp.jwtToken.length > 0) {
          localStorage.setItem('jwtToken', resp.jwtToken);
          localStorage.setItem('refreshToken', resp.refreshToken);
          localStorage.setItem('userFirstName', resp.name);
        }
      }));
  }

  refreshTokens(): Observable<ITokenResponse> {
    const request = {
      refreshToken: this.getRefreshToken()
    } as IRefreshJwtTokenRequest;

    return this.http.post<ITokenResponse>(this.baseUrl + '/refresh-token', request)
      .pipe(
        tap(resp => {
          console.log(resp);
          if (resp.jwtToken.length > 0 && resp.refreshToken.length > 0) {
            localStorage.setItem('jwtToken', resp.jwtToken);
            localStorage.setItem('refreshToken', resp.refreshToken);
          } else {
            this.logout();
            this.router.navigate(['/login']);
            this.toasterService.info('A munkamenet lejárt, kérlek jelentkezz be újra', 'Figyelem!');
          }
        })
      );
  }

  get isLoggedIn(): boolean {
    return this.getJwtToken() !== null;
  }

  getJwtToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getUserFirstName(): string | null {
    return localStorage.getItem('userFirstName');
  }

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userFirstName');
  }
}
