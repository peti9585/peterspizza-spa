import {MatTable, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatColumnDef, MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatRowDef} from '@angular/material/table';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {Component, OnInit, OnDestroy, Inject, inject} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

const TEMP_DATA: Product[] = [
  { id: 1, name: 'Diavola', price: 8.50, quantity: 1, totalPrice: 8.50  },
  { id: 2, name: 'Funghi', price: 8, quantity: 2, totalPrice: 16  },
  { id: 3, name: 'Diavola', price: 8.50, quantity: 1, totalPrice: 8.50  },
  { id: 4, name: 'Funghi', price: 8, quantity: 2, totalPrice: 16  },
  { id: 5, name: 'Diavola', price: 8.50, quantity: 1, totalPrice: 8.50  },
  { id: 6, name: 'Funghi', price: 8, quantity: 2, totalPrice: 16  },
  { id: 7, name: 'Diavola', price: 8.50, quantity: 1, totalPrice: 8.50  },
  { id: 8, name: 'Funghi', price: 8, quantity: 2, totalPrice: 16  },
  { id: 9, name: 'Diavola', price: 8.50, quantity: 1, totalPrice: 8.50  },
  { id: 10, name: 'Funghi', price: 8, quantity: 2, totalPrice: 16  },
];

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
    RouterLink,
  ],
  templateUrl: './cart-main.component.html',
  styleUrl: './cart-main.component.css'
})
export class CartMainComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'price', 'quantity', 'totalPrice', 'edit'];
  dataSource = TEMP_DATA;
  overallPrice: number = this.calculateOverallPrice()

  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.iconRegistry.addSvgIcon('customremove',
      this.sanitizer.bypassSecurityTrustResourceUrl('/images/remove-circle.svg'));
  }

  ngOnInit() {
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
    this.overallPrice = this.calculateOverallPrice();
  }

  increaseQuantity(id: number) {
    const filteredData = this.dataSource.find(item => item.id === id);
    if(filteredData !== undefined) {
      filteredData.quantity++;
      filteredData.totalPrice = filteredData.price * filteredData.quantity;
      this.overallPrice = this.calculateOverallPrice();
    }
  }

  decreaseQuantity(id: number) {
    const filteredData = this.dataSource.find(item => item.id === id);
    if (filteredData !== undefined && filteredData.quantity > 1) {
      filteredData.quantity--;
      filteredData.totalPrice = filteredData.price * filteredData.quantity;
      this.overallPrice = this.calculateOverallPrice();
    }
  }

  private calculateOverallPrice(): number {
    let total = 0;
    this.dataSource.forEach(item => total += item.totalPrice)

    return total;
  }
}
