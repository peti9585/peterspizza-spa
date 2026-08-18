import {ComponentFixture, TestBed} from '@angular/core/testing';
import { IncomingOrdersComponent } from './incoming-orders.component';
import { AdminService } from '../../../services/admin.service';
import { Admin, OrderState } from '../../../interfaces/interfaces-global';
import { vi } from 'vitest';
import {of } from 'rxjs';
import {MatSnackBar, MatSnackBarRef} from '@angular/material/snack-bar';

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
        getAllOrders: vi.fn().mockName('getAllOrders').mockReturnValue(of(incomingOrders))
    };
    const toasterServiceMock = {
      open: vi.fn().mockName('open').mockReturnValue(of(MatSnackBarRef)),
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [IncomingOrdersComponent],
          providers: [
            { provide: AdminService, useValue: adminServiceMock },
            { provide: MatSnackBar, useValue: toasterServiceMock },
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

});
