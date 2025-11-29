import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IGetUserDetailsByIdResponse, IUpdateUserRequest} from '../interfaces/interfaces-global';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:5104/api/user';

  private readonly http = inject(HttpClient);

  getUserDetailsById(): Observable<IGetUserDetailsByIdResponse> {
    return this.http.get<IGetUserDetailsByIdResponse>(this.baseUrl + '/getbyid/');
  }

  updateUser(request: IUpdateUserRequest) {
    return this.http.put(this.baseUrl + '/update-details', request);
  }
}
