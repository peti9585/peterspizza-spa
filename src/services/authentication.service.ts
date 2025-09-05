import {inject, Injectable} from '@angular/core';
import {ILoginData, ILoginResponse, IRegistrationData} from '../interfaces/interfaces-global';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isAuthenticated: boolean = false;
  private token: string | null = null;
  private userFirstName: string | null = null;

  private readonly baseUrl = 'http://localhost:5104/api/user';

  private readonly http = inject(HttpClient);

  submitRegistration(registrationData: IRegistrationData) {
    return this.http.post(this.baseUrl + '/register', registrationData);
  }

  submitLogin(loginData: ILoginData): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(this.baseUrl + '/login', loginData, { withCredentials: true })
      .pipe(tap(resp => {
        if (resp.name.length > 0 && resp.jwtToken.length > 0) {
          this.isAuthenticated = true;
          this.userFirstName = resp.name;
          this.token = resp.jwtToken;
        }
      }));
  }

  getToken(): string | null {
    return this.token;
  }

  async isLoggedIn(): Promise<any> {
    await firstValueFrom(this.http.get(this.baseUrl + '/me', { withCredentials: true }));
  }
}
