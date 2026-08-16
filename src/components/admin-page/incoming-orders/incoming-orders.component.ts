import {Component, DestroyRef, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {AdminService} from '../../../services/admin.service';
import {Admin, OrderState} from '../../../interfaces/interfaces-global';
import {MatButton} from '@angular/material/button';
import {SignalrAdminService} from '../../../services/signalr-admin.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-incoming-orders',
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
    MatButton
  ],
  templateUrl: './incoming-orders.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './incoming-orders.component.css'
})
export class IncomingOrdersComponent implements OnInit{
  displayedColumns: string[] = ['position', 'orderId', 'name', 'orderState', 'orderDate'];
  dataSource: Admin.IGetAllOrderResponse[] = [];

  private readonly adminService = inject(AdminService);
  private readonly toasterService = inject(MatSnackBar);
  private readonly signalRAdminService = inject(SignalrAdminService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly OrderState = OrderState;

  async ngOnInit() {
    this.adminService.getAllOrders().subscribe({
      next: (response) => {
        this.dataSource = response.getAllOrderResponses.map(o => ({
          ...o,
          orderDate: new Date(o.orderDate).toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
      },
      error: (_) => {
        this.toasterService.open(
          'Hiba történt a rendelések betöltése során.',
          'Bezár',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
      }
    });

    await this.signalRAdminService.startConnection();
    this.signalRAdminService.addMessageListener();
    this.signalRAdminService.handleDisconnects();

    this.signalRAdminService.adminOrdersChanged$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(u => {
        this.dataSource = u.getAllOrderResponses.map(o => ({
          ...o,
          orderDate: new Date(o.orderDate).toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
      });
    }

  private expandedOrderId: number | null = null;

  toggleRow(row: Admin.IOrderItem): void {
    this.expandedOrderId = (this.expandedOrderId === row.orderId) ? null : row.orderId;
  }

  isExpanded(row: Admin.IOrderItem): boolean {
    return this.expandedOrderId === row.orderId;
  }

  calculateSumOfOrderItems(orderItems: Admin.IOrderItem[]): number {
    return orderItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  }

  changeOrderState(newOrderState: OrderState, orderId: string): void {
    const request: Admin.IChangeOrderStateRequest = {
      orderId: orderId,
      newOrderState: newOrderState
    }
    this.adminService.changeOrderState(request).subscribe({
      next: (_) => {
        this.dataSource = this.dataSource.map(order =>
          order.orderId === orderId ? { ...order, orderState: newOrderState } : order
        );
        this.toasterService.open(
          'Sikeres státuszváltoztatás.',
          'Bezár',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
          );
      },
      error: (_) => {
        this.toasterService.open(
          'Hiba történt a rendelés státuszának változtatása során.',
          'Bezár',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
          );
      }
    });
  }
}
