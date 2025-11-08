import {MatTable, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatColumnDef, MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatRowDef} from '@angular/material/table';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {Component, OnInit, OnDestroy, Inject, inject} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {PizzaService} from '../../../services/pizza.service';
import {CartService} from '../../../services/cart.service';
import {ToastrService} from 'ngx-toastr';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationComponent} from '../confirmation/confirmation.component';

interface Pizza {
  id: number;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

@Component({
  selector: 'app-cart-main',
  imports: [
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatIconModule,
    MatButton,
    MatProgressSpinner,
    RouterLink,
  ],
  templateUrl: './cart-main.component.html',
  styleUrl: './cart-main.component.css'
})
export class CartMainComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'price', 'quantity', 'totalPrice', 'edit'];
  dataSource: Pizza[] = [];
  overallPrice: number = this.calculateOverallPrice()
  isLoading: boolean = true;

  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cartService = inject(CartService);
  private readonly pizzaService = inject(PizzaService);
  private readonly toasterService = inject(ToastrService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.iconRegistry.addSvgIcon('customremove',
      this.sanitizer.bypassSecurityTrustResourceUrl('/images/remove-circle.svg'));
  }

  ngOnInit() {
    this.getPizzaData();
    this.setResponsiveMargin();
    window.addEventListener('resize', this.setResponsiveMargin.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.setResponsiveMargin.bind(this));
    this.document.body.style.marginLeft = 'var(--margin-default)';
    this.document.body.style.marginRight = 'var(--margin-default)';
  }

  private setResponsiveMargin() {
    if (window.innerWidth < 700) {
      this.document.body.style.margin = '10px';
    } else {
      this.document.body.style.marginLeft = 'var(--margin-default)';
      this.document.body.style.marginRight = 'var(--margin-default)';
    }
  }

  removeItem(id: number) {
    const filteredData = this.dataSource.filter(item => item.id !== id);

    this.dataSource = filteredData;
    this.cartService.removeFromCart(id);
    this.overallPrice = this.calculateOverallPrice();

    if (filteredData.length === 0) {
      this.router.navigate(['/order']);
    }
  }

  increaseQuantity(id: number) {
    const filteredData = this.dataSource.find(item => item.id === id);
    if(filteredData !== undefined) {
      filteredData.quantity++;
      this.cartService.increaseCount(filteredData.id);
      filteredData.totalPrice = parseFloat((filteredData.price * filteredData.quantity).toFixed(2));
      this.overallPrice = this.calculateOverallPrice();
    }
  }

  decreaseQuantity(id: number) {
    const filteredData = this.dataSource.find(item => item.id === id);
    if (filteredData !== undefined && filteredData.quantity > 1) {
      filteredData.quantity--;
      this.cartService.decreaseCount(filteredData.id);
      filteredData.totalPrice = parseFloat((filteredData.price * filteredData.quantity).toFixed(2));
      this.overallPrice = this.calculateOverallPrice();
    }
  }

  openOrderModal() {
    this.dialog.open(ConfirmationComponent);
  }

  private calculateOverallPrice(): number {
    let total = 0;
    this.dataSource.forEach(item => total += item.totalPrice)

    return total;
  }

  private getPizzaData(): void {
    const cartCounts = this.cartService.getCounts();
    const pizzaIds = Object.keys(cartCounts).map(key => parseInt(key));

    this.pizzaService.getPizzasByIds(pizzaIds).subscribe({
      next: (response) => {
        this.dataSource = response.getPizzaResponses
          .filter(p => cartCounts[p.pizzaId] > 0)
          .map(p => {
          const quantity = cartCounts[p.pizzaId];
          const totalPrice = p.pizzaPrice * quantity;

          return {
            id: p.pizzaId,
            name: p.pizzaName,
            price: p.pizzaPrice,
            quantity: quantity,
            totalPrice: parseFloat(totalPrice.toFixed(2)),
          } as Pizza;
        })

        this.isLoading = false;
        this.overallPrice = this.calculateOverallPrice();
      },
      error: (_) => {
        this.toasterService.error('Hiba történt a pizzák lekérése során!', 'Hiba');

        this.dataSource = [];
      }
    });
  }
}
