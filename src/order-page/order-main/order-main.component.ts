import {Component, inject} from '@angular/core';
import {OrderPizzaCardComponent} from '../order-pizza-card/order-pizza-card.component';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {InfoModalComponent} from '../info-modal/info-modal.component';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-order-main',
  imports: [
    OrderPizzaCardComponent,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './order-main.component.html',
  styleUrl: './order-main.component.css'
})
export class OrderMainComponent {
  orderNumber: number = 0;

  private readonly dialog = inject(MatDialog);
  private readonly cookieService = inject(CookieService);

  constructor() {
    const isInfoModalClosed = this.cookieService.get('infoModalClosed');
    if (!isInfoModalClosed) {
      this.dialog.open(InfoModalComponent, { disableClose: true });
    }
  }

  handleAddToCart(number: number) {
    this.orderNumber += number;
  }
}
