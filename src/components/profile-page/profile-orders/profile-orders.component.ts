import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {PizzaService} from '../../../services/pizza.service';
import {ToastrService} from 'ngx-toastr';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {SignalrService} from '../../../services/signalr.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile-orders',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatProgressSpinner,
  ],
  templateUrl: './profile-orders.component.html',
  styleUrl: './profile-orders.component.css'
})
export class ProfileOrdersComponent implements OnInit{
  displayedColumns: string[] = ['position', 'orderId', 'orderState', 'orderDate'];
  dataSource: any[] = [];
  isLoading: boolean = true;

  private readonly pizzaService = inject(PizzaService);
  private readonly toasterService = inject(ToastrService);
  private readonly signalRService = inject(SignalrService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.pizzaService.getAllOrdersById().subscribe({
      next: (response) => {
        this.dataSource = response.getAllOrderResponses
          .sort((a, b) => a.orderDate < b.orderDate ? 1 : -1)
          .map(((r, i) => {
            return {
              position: '#' + (i + 1),
              orderId: r.orderId.toString(),
              orderState: this.mapOrderState(r.orderState),
              orderDate: this.formatDate(r.orderDate)
            }
          }));

        this.signalRService.startConnection();
        this.signalRService.addMessageListener();
        this.signalRService.handleDisconnects();

        this.signalRService.orderStatusChanged$
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((u) => {
            const index = this.dataSource
              .findIndex(o => o.orderId === u.orderId.toLowerCase());

            if (index === -1) return;

            this.dataSource[index] = {
              ...this.dataSource[index],
              orderState: this.mapOrderState(u.newOrderState),
            };

            this.dataSource = [...this.dataSource];
          })

        this.isLoading = false;
      },
      error: (_) => {
        this.toasterService.error('Hiba történt a kérés teljesítése során!', 'Hiba');
      }
    });
  }

  private mapOrderState(orderState: number): string {
    switch(orderState) {
      case 0:
        return 'Undefined'
      case 1:
        return 'Várakozás az elfogadásra'
      case 2:
        return 'Készítés alatt'
      case 3:
        return 'Készen áll az átvételre'
      case 4:
        return 'Átvett'
    }

    return '';
  }

  private formatDate(dateInput: string): string {
    const d = new Date(dateInput);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }
}
