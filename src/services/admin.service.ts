import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Admin} from '../interfaces/interfaces-global';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = environment.apiBaseUrl + '/api/admin';

  private readonly http = inject(HttpClient);

  getAllOrders(): Observable<Admin.IGetAllOrdersResponse> {
    return this.http.get<Admin.IGetAllOrdersResponse>(this.baseUrl + '/orders/all');
  }

  changeOrderState(request: Admin.IChangeOrderStateRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/orders/change', request);
  }
}
