import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ProfileOrdersComponent } from './profile-orders.component';
import { PizzaService } from '../../../services/pizza.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignalrService } from '../../../services/signalr.service';
import { IGetAllOrdersResponse } from '../../../interfaces/interfaces-global';
import { of, Subject } from 'rxjs';

describe('ProfileOrdersComponent', () => {
  let component: ProfileOrdersComponent;
  let fixture: ComponentFixture<ProfileOrdersComponent>;

  const getAllOrdersResponse: IGetAllOrdersResponse = {
    getAllOrderResponses: [
      { orderId: '1', orderState: 1, orderDate: '2026-08-10 10:00' }
    ]
  };

  const pizzaServiceMock = {
    getAllOrdersById: vi.fn().mockName('getAllOrdersById').mockReturnValue(of(getAllOrdersResponse))
  };

  const toasterMock = {
    open: vi.fn().mockName('open')
  };

  const signalRServiceMock = {
    startConnection: vi.fn().mockName('startConnection').mockResolvedValue(undefined),
    addMessageListener: vi.fn().mockName('addMessageListener'),
    handleDisconnects: vi.fn().mockName('handleDisconnects'),
    orderStatusChanged$: new Subject()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileOrdersComponent],
      providers: [
        { provide: PizzaService, useValue: pizzaServiceMock },
        { provide: MatSnackBar, useValue: toasterMock },
        { provide: SignalrService, useValue: signalRServiceMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
