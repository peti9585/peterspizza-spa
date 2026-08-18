import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, Subject, throwError } from 'rxjs';
import { ProfileOrdersComponent } from './profile-orders.component';
import { PizzaService } from '../../../services/pizza.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignalrService } from '../../../services/signalr.service';
import { IGetAllOrdersResponse, IOrderStatusChanged } from '../../../interfaces/interfaces-global';

describe('ProfileOrdersComponent', () => {
  let component: ProfileOrdersComponent;
  let fixture: ComponentFixture<ProfileOrdersComponent>;
  let orderStatusChanged$: Subject<IOrderStatusChanged>;

  const defaultResponse: IGetAllOrdersResponse = {
    getAllOrderResponses: [
      { orderId: '1', orderState: 1, orderDate: '2026-08-10 10:00' }
    ]
  };

  const pizzaServiceMock = {
    getAllOrdersById: vi.fn().mockName('getAllOrdersById').mockReturnValue(of(defaultResponse))
  };

  const toasterMock = {
    open: vi.fn().mockName('open')
  };

  let signalRServiceMock: {
    startConnection: ReturnType<typeof vi.fn>;
    addMessageListener: ReturnType<typeof vi.fn>;
    handleDisconnects: ReturnType<typeof vi.fn>;
    orderStatusChanged$: Subject<IOrderStatusChanged>;
  };

  beforeEach(async () => {
    orderStatusChanged$ = new Subject<IOrderStatusChanged>();
    signalRServiceMock = {
      startConnection: vi.fn().mockName('startConnection').mockResolvedValue(undefined),
      addMessageListener: vi.fn().mockName('addMessageListener'),
      handleDisconnects: vi.fn().mockName('handleDisconnects'),
      orderStatusChanged$,
    };

    await TestBed.configureTestingModule({
      imports: [ProfileOrdersComponent],
      providers: [
        { provide: PizzaService, useValue: pizzaServiceMock },
        { provide: MatSnackBar, useValue: toasterMock },
        { provide: SignalrService, useValue: signalRServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileOrdersComponent);
    component = fixture.componentInstance;
    vi.clearAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should call getAllOrdersById on init', () => {
    fixture.detectChanges();

    expect(pizzaServiceMock.getAllOrdersById).toHaveBeenCalled();
  });

  it('should populate dataSource with mapped order data after fetch', () => {
    fixture.detectChanges();

    expect(component.dataSource).toHaveLength(1);
    expect(component.dataSource[0]).toEqual({
      position: '#1',
      orderId: '1',
      orderState: 'Várakozás az elfogadásra',
      orderDate: '10-08-2026',
    });
  });

  it('should set isLoading to true initially', () => {
    expect(component.isLoading).toBeTruthy();
  });

  it('should set isLoading to false after successful fetch', () => {
    fixture.detectChanges();

    expect(component.isLoading).toBeFalsy();
  });

  it('should not set isLoading to false when fetch fails', () => {
    // Arrange
    pizzaServiceMock.getAllOrdersById.mockReturnValueOnce(throwError(() => new Error('Network error')));

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.isLoading).toBeTruthy();
  });

  it('should sort orders by date descending', () => {
    // Arrange
    const response: IGetAllOrdersResponse = {
      getAllOrderResponses: [
        { orderId: 'oldest', orderState: 1, orderDate: '2026-08-01 10:00' },
        { orderId: 'newest', orderState: 1, orderDate: '2026-08-15 10:00' },
        { orderId: 'middle', orderState: 1, orderDate: '2026-08-08 10:00' },
      ]
    };
    pizzaServiceMock.getAllOrdersById.mockReturnValueOnce(of(response));

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.dataSource[0].orderId).toBe('newest');
    expect(component.dataSource[1].orderId).toBe('middle');
    expect(component.dataSource[2].orderId).toBe('oldest');
  });

  it('should assign sequential position numbers after sorting', () => {
    // Arrange
    const response: IGetAllOrdersResponse = {
      getAllOrderResponses: [
        { orderId: 'a', orderState: 1, orderDate: '2026-08-01 10:00' },
        { orderId: 'b', orderState: 1, orderDate: '2026-08-10 10:00' },
      ]
    };
    pizzaServiceMock.getAllOrdersById.mockReturnValueOnce(of(response));

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.dataSource[0].position).toBe('#1'); // b (newer) gets #1
    expect(component.dataSource[1].position).toBe('#2'); // a (older) gets #2
  });

  it('should format date as dd-mm-yyyy', () => {
    // Arrange
    pizzaServiceMock.getAllOrdersById.mockReturnValueOnce(of({
      getAllOrderResponses: [{ orderId: '1', orderState: 1, orderDate: '2026-03-07 12:00' }]
    }));

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.dataSource[0].orderDate).toBe('07-03-2026');
  });

  describe('order state mapping', () => {
    const testCases = [
      { state: 0, expected: 'Undefined' },
      { state: 1, expected: 'Várakozás az elfogadásra' },
      { state: 2, expected: 'Készítés alatt' },
      { state: 3, expected: 'Készen áll az átvételre' },
      { state: 4, expected: 'Átvett' },
    ];

    testCases.forEach(({ state, expected }) => {
      it(`should map order state ${state} to "${expected}"`, () => {
        // Arrange
        pizzaServiceMock.getAllOrdersById.mockReturnValueOnce(of({
          getAllOrderResponses: [{ orderId: '1', orderState: state, orderDate: '2026-08-10 10:00' }]
        }));

        // Act
        fixture.detectChanges();

        // Assert
        expect(component.dataSource[0].orderState).toBe(expected);
      });
    });
  });

  it('should start SignalR connection after successful fetch', () => {
    fixture.detectChanges();

    expect(signalRServiceMock.startConnection).toHaveBeenCalled();
    expect(signalRServiceMock.addMessageListener).toHaveBeenCalled();
    expect(signalRServiceMock.handleDisconnects).toHaveBeenCalled();
  });

  it('should not start SignalR connection when fetch fails', () => {
    // Arrange
    pizzaServiceMock.getAllOrdersById.mockReturnValueOnce(throwError(() => new Error('Network error')));

    // Act
    fixture.detectChanges();

    // Assert
    expect(signalRServiceMock.startConnection).not.toHaveBeenCalled();
  });

  it('should update order state in dataSource when SignalR emits orderStatusChanged$', () => {
    // Arrange
    fixture.detectChanges();

    // Act
    orderStatusChanged$.next({ orderId: '1', newOrderState: 2 });

    // Assert
    expect(component.dataSource[0].orderState).toBe('Készítés alatt');
  });

  it('should replace the dataSource reference on SignalR update for change detection', () => {
    // Arrange
    fixture.detectChanges();
    const originalRef = component.dataSource;

    // Act
    orderStatusChanged$.next({ orderId: '1', newOrderState: 3 });

    // Assert — spread ensures a new array reference for OnPush-compatible change detection
    expect(component.dataSource).not.toBe(originalRef);
  });

  it('should not modify dataSource when SignalR emits an unknown orderId', () => {
    // Arrange
    fixture.detectChanges();
    const snapshotBefore = [...component.dataSource];

    // Act
    orderStatusChanged$.next({ orderId: 'unknown-id', newOrderState: 2 });

    // Assert
    expect(component.dataSource).toEqual(snapshotBefore);
  });

  it('should pop a toaster when fetch fails', () => {
    // Arrange
    pizzaServiceMock.getAllOrdersById.mockReturnValueOnce(throwError(() => new Error('Network error')));

    // Act
    fixture.detectChanges();

    // Assert
    expect(toasterMock.open).toHaveBeenCalledWith(
      'Hiba történt a kérés teljesítése során!',
      'Bezár',
      expect.objectContaining({
        horizontalPosition: 'center',
        verticalPosition: 'top',
      })
    );
  });

  it('should not call toaster on successful fetch', () => {
    fixture.detectChanges();

    expect(toasterMock.open).not.toHaveBeenCalled();
  });
});
