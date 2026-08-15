import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Admin} from '../interfaces/interfaces-global';
import IGetAllOrdersResponse = Admin.IGetAllOrdersResponse;
import IChangeOrderStateRequest = Admin.IChangeOrderStateRequest;
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly baseUrl = environment.apiBaseUrl + '/api/admin';

  private readonly http = inject(HttpClient);

  getAllOrders(): Observable<IGetAllOrdersResponse> {
    return this.http.get<IGetAllOrdersResponse>(this.baseUrl + '/orders/all');
  }

  changeOrderState(request: IChangeOrderStateRequest): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/orders/change', request);
  }
}
