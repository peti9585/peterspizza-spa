import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IncomingOrdersComponent} from './incoming-orders.component';
import {AdminService} from '../../../services/admin.service';
import {Admin, OrderState} from '../../../interfaces/interfaces-global';
import {vi} from 'vitest';
import {of, Subject, throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SignalrAdminService} from '../../../services/signalr-admin.service';

describe('IncomingOrdersComponent', () => {
  let component: IncomingOrdersComponent;
  let fixture: ComponentFixture<IncomingOrdersComponent>;

  const incomingOrders: Admin.IGetAllOrdersResponse = {
    getAllOrderResponses: [
      {
        orderId: '1',
        userName: 'peti9585',
        orderState: OrderState.Preparing,
        orderDate: '2026.08.15. 10:00',
        orderItems: [
          {
            orderId: 1,
            pizzaName: 'Margherita',
            quantity: 2,
            price: 10.50,
          }
        ],
      },
      {
        orderId: '2',
        userName: 'peti8595',
        orderState: OrderState.Done,
        orderDate: '2026.08.15. 09:00',
        orderItems: [
          {
            orderId: 2,
            pizzaName: 'Diavola',
            quantity: 1,
            price: 5.0
          }
        ],
      },
      {
        orderId: '10',
        userName: 'peti7595',
        orderState: OrderState.ReadyToPickUp,
        orderDate: '2026.08.15. 12:00',
        orderItems: [
          {
            orderId: 10,
            pizzaName: 'Prosciutto Cotto',
            quantity: 1,
            price: 6.0
          }
        ]
      },
    ]
  };

  const adminServiceMock = {
    getAllOrders: vi.fn().mockName('getAllOrders').mockReturnValue(of(incomingOrders)),
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
      imports: [IncomingOrdersComponent],
      providers: [
        {provide: AdminService, useValue: adminServiceMock},
        {provide: MatSnackBar, useValue: toasterServiceMock},
        {provide: SignalrAdminService, useValue: signalRAdminServiceMock},
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(IncomingOrdersComponent);
    component = fixture.componentInstance;
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the incoming orders', () => {
    // Arrange
    const expectedDataSource: Admin.IGetAllOrderResponse[] = [
      {
        orderId: '1',
        userName: 'peti9585',
        orderState: OrderState.Preparing,
        orderDate: '2026. 08. 15. 10:00',
        orderItems: [
          {
            orderId: 1,
            pizzaName: 'Margherita',
            quantity: 2,
            price: 10.50,
          }
        ],
      },
      {
        orderId: '2',
        userName: 'peti8595',
        orderState: OrderState.Done,
        orderDate: '2026. 08. 15. 09:00',
        orderItems: [
          {
            orderId: 2,
            pizzaName: 'Diavola',
            quantity: 1,
            price: 5.0
          }
        ],
      },
      {
        orderId: '10',
        userName: 'peti7595',
        orderState: OrderState.ReadyToPickUp,
        orderDate: '2026. 08. 15. 12:00',
        orderItems: [
          {
            orderId: 10,
            pizzaName: 'Prosciutto Cotto',
            quantity: 1,
            price: 6.0
          }
        ]
      },
    ];
    // Act
    fixture.detectChanges();

    // Assert
    expect(adminServiceMock.getAllOrders).toHaveBeenCalled();
    expect(component.dataSource).toEqual(expectedDataSource);
  });

  it('should pop an error toaster in case an error occurs during loading the orders', () => {
    // Arrange
    adminServiceMock.getAllOrders.mockReturnValueOnce(throwError(() => new Error('Error')));

    // Act
    fixture.detectChanges();

    // Assert
    expect(toasterServiceMock.open).toHaveBeenCalledWith(
      'Hiba történt a rendelések betöltése során.',
      'Bezár',
      expect.objectContaining({
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      })
    )
  });

  it('should call changeOrderState with correct request', () => {
    const response = of({});

    adminServiceMock.changeOrderState.mockReturnValue(response);

    component.changeOrderState(
      OrderState.Done,
      'order-1'
    );

    expect(adminServiceMock.changeOrderState).toHaveBeenCalledWith({
      orderId: 'order-1',
      newOrderState: OrderState.Done
    });
  });

  it('should update datasource and show success toaster on success', () => {
    adminServiceMock.changeOrderState.mockReturnValue(of({}));

    component.dataSource = [
      {
        orderId: 'order-1',
        userName: 'peti123',
        orderState: OrderState.WaitingToAccept,
        orderDate: '',
        orderItems: []
      },
      {
        orderId: 'order-2',
        userName: 'peti123',
        orderState: OrderState.WaitingToAccept,
        orderDate: '',
        orderItems: []
      }
    ];

    component.changeOrderState(
      OrderState.Preparing,
      'order-1'
    );

    expect(component.dataSource[0].orderState)
      .toBe(OrderState.Preparing);

    expect(component.dataSource[1].orderState)
      .toBe(OrderState.WaitingToAccept);

    expect(toasterServiceMock.open).toHaveBeenCalledWith(
      'Sikeres státuszváltoztatás.',
      '',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['success-snackbar']
      }
    );
  });

  it('should show an error toaster when changeOrderState request fails', () => {
    adminServiceMock.changeOrderState.mockReturnValue(
      throwError(() => new Error('API error'))
    );

    component.dataSource = [
      {
        orderId: 'order-1',
        userName: 'peti123',
        orderState: OrderState.WaitingToAccept,
        orderDate: '',
        orderItems: []
      }
    ];

    component.changeOrderState(
      OrderState.Preparing,
      'order-1'
    );

    expect(component.dataSource[0].orderState)
      .toBe(OrderState.WaitingToAccept);

    expect(toasterServiceMock.open).toHaveBeenCalledWith(
      'Hiba történt a rendelés státuszának változtatása során.',
      'Bezár',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      }
    );
  });

});
