import {Component, Input, output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {IGetPizzaResponse} from '../../../interfaces/interfaces-global';

@Component({
  selector: 'app-order-pizza-card',
  imports: [
    MatButtonModule,
    MatTooltip
  ],
  templateUrl: './order-pizza-card.component.html',
  styleUrl: './order-pizza-card.component.css'
})
export class OrderPizzaCardComponent {
  addToCartEvent = output<number>();
  @Input() pizzaDetail!: IGetPizzaResponse;

  onAddToCart() {
    this.addToCartEvent.emit(1);
  }
  get truncatedText(): string {
    const maxLength = 70;
    if (this.pizzaDetail.description.length <= maxLength) {
      return this.pizzaDetail.description;
    }
    return this.pizzaDetail.description.substring(0, maxLength).trim() + '...';
  }
}
