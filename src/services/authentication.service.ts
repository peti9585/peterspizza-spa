import {inject, Injectable} from '@angular/core';
import {ILoginData, ILoginResponse, IRegistrationData} from '../interfaces/interfaces-global';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly baseUrl = 'http://localhost:5104/api/user';

  private readonly http = inject(HttpClient);

  submitRegistration(registrationData: IRegistrationData) {
    return this.http.post(this.baseUrl + '/register', registrationData);
  }

  submitLogin(loginData: ILoginData): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(this.baseUrl + '/login', loginData, { withCredentials: true })
      .pipe(tap(resp => {
        if (resp.name.length > 0 && resp.jwtToken.length > 0) {
          localStorage.setItem('jwtToken', resp.jwtToken);
          localStorage.setItem('userFirstName', resp.name);
        }
      }));
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getUserFirstName(): string | null {
    return localStorage.getItem('userFirstName');
  }

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userFirstName');
  }
}
