import {Component, inject, OnInit} from '@angular/core';
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
import IGetAllOrderResponse = Admin.IGetAllOrderResponse;
import {MatButton} from '@angular/material/button';
import IOrderItem = Admin.IOrderItem;
import {ToastrService} from 'ngx-toastr';
import IChangeOrderStateRequest = Admin.IChangeOrderStateRequest;
import {SignalrAdminService} from '../../../services/signalr-admin.service';

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
  styleUrl: './incoming-orders.component.css'
})
export class IncomingOrdersComponent implements OnInit{
  displayedColumns: string[] = ['position', 'orderId', 'name', 'orderState', 'orderDate'];
  dataSource: IGetAllOrderResponse[] = [];

  private readonly adminService = inject(AdminService);
  private readonly toasterService = inject(ToastrService);
  private readonly signalRAdminService = inject(SignalrAdminService);

  protected readonly OrderState = OrderState;

  ngOnInit(): void {
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
        this.toasterService.error('Hiba történt a rendelések betöltése során.', 'Hiba');
      }
    });

    this.signalRAdminService.startConnection();
    this.signalRAdminService.addMessageListener();
    this.signalRAdminService.handleDisconnects();

    this.signalRAdminService.adminOrdersChanged$
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

  toggleRow(row: IOrderItem): void {
    this.expandedOrderId = (this.expandedOrderId === row.orderId) ? null : row.orderId;
  }

  isExpanded(row: IOrderItem): boolean {
    return this.expandedOrderId === row.orderId;
  }

  calculateSumOfOrderItems(orderItems: IOrderItem[]): number {
    return orderItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  }

  changeOrderState(newOrderState: OrderState, orderId: string): void {
    const request: IChangeOrderStateRequest = {
      orderId: orderId,
      newOrderState: newOrderState
    }
    this.adminService.changeOrderState(request).subscribe({
      next: (_) => {
        this.dataSource = this.dataSource.map(order =>
          order.orderId === orderId ? { ...order, orderState: newOrderState } : order
        );
        this.toasterService.success('Sikeres státuszváltoztatás.', 'Siker');
      },
      error: (_) => {
        this.toasterService.error('Hiba történt a rendelés státuszának változtatása során.', 'Hiba');
      }
    });
  }
}
