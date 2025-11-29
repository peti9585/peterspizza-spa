import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {
  IGetAllOrdersResponse,
  IGetAllPizzasResponse,
  IGetPizzasByIdsResponse,
  IOrderPizzasRequest
} from '../interfaces/interfaces-global';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  private readonly baseUrl = 'http://localhost:5104/api/pizza';

  private readonly http = inject(HttpClient);
  getAllPizzaDetails(): Observable<IGetAllPizzasResponse> {
    return this.http.get<IGetAllPizzasResponse>(this.baseUrl + '/getall');
  }

  getPizzasByIds(pizzaIds: number[]): Observable<IGetPizzasByIdsResponse> {
    return this.http.post<IGetPizzasByIdsResponse>(this.baseUrl + '/getbyids', pizzaIds);
  }

  sendOrder(request: IOrderPizzasRequest) {
    return this.http.post(this.baseUrl + '/order', request);
  }

  getAllOrdersById(): Observable<IGetAllOrdersResponse> {
    return this.http.get<IGetAllOrdersResponse>(this.baseUrl + '/orders-all/');
  }
}
