import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartStorageKey = 'cartCounts';
  private countsSubject = new BehaviorSubject<Record<number, number>>(this.load());

  private load(): Record<number, number> {
    const storedCounts = sessionStorage.getItem(this.cartStorageKey);
    return storedCounts ? JSON.parse(storedCounts) : {};
  }

  private save(counts: Record<number, number>) {
    sessionStorage.setItem(this.cartStorageKey, JSON.stringify(counts));
  }

  getCounts(): Record<number, number> {
    return {...this.countsSubject.getValue()};
  }

  addToCart(cartCounts: Record<number, number>) {
    this.countsSubject.next(cartCounts);
    this.save(cartCounts);
  }

  removeFromCart(pizzaId: number) {
    const currentCounts = this.getCounts();
    delete currentCounts[pizzaId];

    this.addToCart(currentCounts);
  }

  removeAllFromCart() {
    sessionStorage.removeItem(this.cartStorageKey);
    this.countsSubject.next({});
  }

  increaseCount(pizzaId: number) {
    const currentCounts = this.getCounts();
    currentCounts[pizzaId]++;

    this.addToCart(currentCounts);
  }

  decreaseCount(pizzaId: number) {
    const currentCounts = this.getCounts();

    if (currentCounts[pizzaId] > 0) {
      currentCounts[pizzaId]--;
    }

    this.addToCart(currentCounts);
  }
}
