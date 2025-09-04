import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ILoginData, IRegistrationData} from '../interfaces/interfaces-global';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrlBase = 'http://localhost:5104/api/';

  private readonly http = inject(HttpClient);

  submitRegistration(registrationData: IRegistrationData) {
    return this.http.post(this.apiUrlBase + 'user/register', registrationData);
  }

  submitLogin(loginData: ILoginData) {
    return this.http.post<string>(this.apiUrlBase + 'user/login', loginData, { withCredentials: true });
  }
}
