import {Component, inject, Input, output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {IGetPizzaResponse} from '../../../interfaces/interfaces-global';
import {CartService} from '../../../services/cart.service';

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

  private readonly cartService = inject(CartService);

  get count(): number {
    const counts = this.cartService.getCounts();
    return counts[this.pizzaDetail.pizzaId] ?? 0;
  }

  increase(): void {
    this.cartService.increaseCount(this.pizzaDetail.pizzaId);
  }

  decrease(): void {
    if (this.count >= 1){
      this.cartService.decreaseCount(this.pizzaDetail.pizzaId);
    }
  }

  onAddToCart() {
    this.addToCartEvent.emit(this.pizzaDetail.pizzaId);
  }
  get truncatedText(): string {
    const maxLength = 70;
    if (this.pizzaDetail.description.length <= maxLength) {
      return this.pizzaDetail.description;
    }
    return this.pizzaDetail.description.substring(0, maxLength).trim() + '...';
  }
}
