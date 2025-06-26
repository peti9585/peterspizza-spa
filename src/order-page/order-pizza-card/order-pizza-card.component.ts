import {Component, output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';

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
  fullText: string = "lorem ipsum lorem. lorem ipsum lorem. lorem ipsum lorem.lorem ipsum lorem. lorem ipsum lorem. lorem ipsum lorem.lorem ipsum lorem. lorem ipsum lorem. lorem ipsum lorem";

  onAddToCart() {
    this.addToCartEvent.emit(1);
  }
  get truncatedText(): string {
    const maxLength = 70;
    if (this.fullText.length <= maxLength) {
      return this.fullText;
    }
    return this.fullText.substring(0, maxLength).trim() + '...';
  }
}
