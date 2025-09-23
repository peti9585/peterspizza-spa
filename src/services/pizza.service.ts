import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IGetAllPizzasResponse} from '../interfaces/interfaces-global';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  private readonly baseUrl = 'http://localhost:5104/api/pizza';

  private readonly http = inject(HttpClient);
  getAllPizzaDetails(): Observable<IGetAllPizzasResponse> {
    return this.http.get<IGetAllPizzasResponse>(this.baseUrl + '/getall');
  }
}
