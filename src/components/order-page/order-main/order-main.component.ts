import {Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {OrderPizzaCardComponent} from '../order-pizza-card/order-pizza-card.component';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {InfoModalComponent} from '../info-modal/info-modal.component';
import {CookieService} from 'ngx-cookie-service';
import {PizzaService} from '../../../services/pizza.service';

import {IGetAllPizzasResponse} from '../../../interfaces/interfaces-global';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {CartService} from '../../../services/cart.service';

@Component({
  selector: 'app-order-main',
  imports: [
    OrderPizzaCardComponent,
    MatButtonModule,
    RouterLink,
    MatProgressSpinner
],
  templateUrl: './order-main.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './order-main.component.css'
})
export class OrderMainComponent implements OnInit {
  pizzas!: IGetAllPizzasResponse;
  isLoading: boolean = true;
  isCartEmpty: boolean = true;

  private readonly dialog = inject(MatDialog);
  private readonly cookieService = inject(CookieService);
  private readonly pizzaService = inject(PizzaService);
  private readonly cartService = inject(CartService);
  private readonly pizzas$ = this.pizzaService.getAllPizzaDetails();

  ngOnInit(): void {
    this.pizzas$.subscribe({
      next: (response) => {
        this.pizzas = response;
        this.isLoading = false;
      }
    });

    this.checkIfCartIsEmpty();

    const isInfoModalClosed = this.cookieService.get('infoModalClosed');
    if (!isInfoModalClosed) {
      this.dialog.open(InfoModalComponent, { disableClose: true });
    }
  }

  handleCountChanged(): void {
    this.checkIfCartIsEmpty();
  }

  handleAddToCart(pizzaId: number) {
    const cardCounts = this.cartService.getCounts();
    if (!cardCounts[pizzaId]) {
      cardCounts[pizzaId] = 1;
    }else {
      cardCounts[pizzaId]++;
    }

    this.cartService.addToCart(cardCounts);
    this.checkIfCartIsEmpty();
  }

  private checkIfCartIsEmpty(): void {
    const cardCounts = this.cartService.getCounts();
    this.isCartEmpty = !(cardCounts && Object.values(cardCounts).some(count => count > 0));
  }
}
