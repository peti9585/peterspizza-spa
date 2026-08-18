import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { vi } from 'vitest';
import { of, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../services/admin.service';
import { SignalrAdminService } from '../../../services/signalr-admin.service';
import { Admin, OrderState } from '../../../interfaces/interfaces-global';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  const getAllOrdersResponse: Admin.IGetAllOrdersResponse = {
    getAllOrderResponses: [
      {
        orderId: '1',
        userName: 'testuser',
        orderState: OrderState.WaitingToAccept,
        orderDate: '2026-08-10 10:00',
        orderItems: [
          { orderId: 1, pizzaName: 'Margherita', quantity: 2, price: 10 }
        ]
      }
    ]
  };

  const adminServiceMock = {
    getAllOrders: vi.fn().mockName('getAllOrders').mockReturnValue(of(getAllOrdersResponse)),
    changeOrderState: vi.fn().mockName('changeOrderState').mockReturnValue(of({})),
  };

  const toasterServiceMock = {
    open: vi.fn().mockName('open'),
  };

  const signalRAdminServiceMock = {
    startConnection: vi.fn().mockName('startConnection').mockResolvedValue(undefined),
    addMessageListener: vi.fn().mockName('addMessageListener'),
    handleDisconnects: vi.fn().mockName('handleDisconnects'),
    adminOrdersChanged$: new Subject(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        { provide: AdminService, useValue: adminServiceMock },
        { provide: MatSnackBar, useValue: toasterServiceMock },
        { provide: SignalrAdminService, useValue: signalRAdminServiceMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
