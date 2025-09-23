import {Component, inject, OnInit} from '@angular/core';
import {OrderPizzaCardComponent} from '../order-pizza-card/order-pizza-card.component';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {InfoModalComponent} from '../info-modal/info-modal.component';
import {CookieService} from 'ngx-cookie-service';
import {PizzaService} from '../../../services/pizza.service';
import {IGetAllPizzasResponse} from '../../../interfaces/interfaces-global';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-order-main',
  imports: [
    OrderPizzaCardComponent,
    MatButtonModule,
    RouterLink,
    NgForOf
  ],
  templateUrl: './order-main.component.html',
  styleUrl: './order-main.component.css'
})
export class OrderMainComponent implements OnInit {
  orderNumber: number = 0;
  pizzaDetails!: IGetAllPizzasResponse;

  private readonly dialog = inject(MatDialog);
  private readonly cookieService = inject(CookieService);
  private readonly pizzaService = inject(PizzaService);

  ngOnInit(): void {
    this.pizzaService.getAllPizzaDetails()
      .subscribe({
        next: (response) => {
          this.pizzaDetails = response;
        }
      });

    const isInfoModalClosed = this.cookieService.get('infoModalClosed');
    if (!isInfoModalClosed) {
      this.dialog.open(InfoModalComponent, { disableClose: true });
    }
  }

  handleAddToCart(number: number) {
    this.orderNumber += number;
  }
}
