import {inject, Injectable} from '@angular/core';
import {
  IJwtTokenInformationRequest,
  IJwtTokenInformationResponse,
  ILoginData,
  ILoginResponse,
  IRefreshJwtTokenRequest,
  IRegistrationData,
  ITokenResponse,
  LoginType
} from '../interfaces/interfaces-global';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly baseUrlForUser = environment.apiBaseUrl + '/api/user';
  private readonly baseUrlForAdmin = environment.apiBaseUrl + '/api/admin';

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toasterService = inject(ToastrService);

  submitRegistration(registrationData: IRegistrationData) {
    return this.http.post(this.baseUrlForUser + '/register', registrationData);
  }

  submitLogin(loginData: ILoginData, loginType: LoginType): Observable<ILoginResponse> {
    const baseUrl = loginType === LoginType.User
      ? this.baseUrlForUser
      : this.baseUrlForAdmin;

    return this.http.post<ILoginResponse>(baseUrl + '/login', loginData)
      .pipe(tap(resp => {
        if (resp.name.length > 0 && resp.jwtToken.length > 0) {
          localStorage.setItem('jwtToken', resp.jwtToken);

          if (loginType === LoginType.User) {
            localStorage.setItem('refreshToken', resp.refreshToken);
          }

          localStorage.setItem('userFirstName', resp.name);
        }
      }));
  }

  refreshTokens(): Observable<ITokenResponse> {
    const request = {
      refreshToken: this.getRefreshToken()
    } as IRefreshJwtTokenRequest;

    return this.http.post<ITokenResponse>(this.baseUrlForUser + '/refresh-token', request)
      .pipe(
        tap(resp => {
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

  get isAdmin(): Observable<IJwtTokenInformationResponse> {
    const jwtToken = this.getJwtToken();
    const request: IJwtTokenInformationRequest = {
      jwtToken: jwtToken ?? ''
    };

    return this.http.post<IJwtTokenInformationResponse>(this.baseUrlForAdmin + '/permission', request);
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
