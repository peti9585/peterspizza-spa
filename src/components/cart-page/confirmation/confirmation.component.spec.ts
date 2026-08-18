import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationComponent } from './confirmation.component';
import {of, throwError} from 'rxjs';
import {IGetUserDetailsByIdResponse, IOrderPizzasRequest} from '../../../interfaces/interfaces-global';
import {UserService} from '../../../services/user.service';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CartService} from '../../../services/cart.service';
import {PizzaService} from '../../../services/pizza.service';
import {Router} from '@angular/router';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  const getUserDetailsByIdResponse: IGetUserDetailsByIdResponse = {
    firstName: 'Peter',
    lastName: 'Kis',
    phoneNumber: '0912345678',
    email: 'temporalemail@gmail.com',
  };
  const getCountsResponse: Record<number, number> = {
    1: 2,
    2: 1,
    3: 2
  };

  const userServiceMock = {
    getUserDetailsById: vi.fn().mockName('getUserDetailsById').mockReturnValue(of(getUserDetailsByIdResponse))
  };
  const toasterServiceMock = {
    open: vi.fn().mockName('open')
  }
  const cartServiceMock = {
    getCounts: vi.fn().mockName('getCounts').mockReturnValue(getCountsResponse),
    removeAllFromCart: vi.fn().mockName('removeAllFromCart')
  }
  const pizzaServiceMock = {
    sendOrder: vi.fn().mockName('sendOrder').mockReturnValue(of(null))
  }
  const routerMock = {
    navigate: vi.fn().mockName('navigate'),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        { provide: UserService, useValue: userServiceMock },
        { provide: MatSnackBar, useValue: toasterServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: PizzaService, useValue: pizzaServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the user details when the page loads', () => {
    // Arrange
    const expectedFormGroupValues = {
      fullName: 'Peter Kis',
      phoneNumber: '0912345678',
      email: 'temporalemail@gmail.com',
    };

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.formGroup?.get('fullName')?.value).toEqual(expectedFormGroupValues.fullName);
    expect(component.formGroup?.get('phoneNumber')?.value).toEqual(expectedFormGroupValues.phoneNumber);
    expect(component.formGroup?.get('email')?.value).toEqual(expectedFormGroupValues.email);
    expect(toasterServiceMock.open).not.toHaveBeenCalled();
  });

  it('should pop an error toaster when the page load fetch failed', () => {
    // Arrange
    userServiceMock.getUserDetailsById.mockReturnValueOnce(throwError(() => new Error('Error')));

    // Act
    fixture.detectChanges();

    // Assert
    expect(toasterServiceMock.open).toHaveBeenCalled();
    expect(component.isLoading).toBeTruthy();
  });

  it('should set the isLoading to false when the fetch completed', () => {
    // Act + Assert
    expect(component.isLoading).toBeTruthy();

    fixture.detectChanges();

    expect(component.isLoading).toBeFalsy();
  });

  it('should send order properly and navigate to the home page', () => {
    // Arrange
    const expectedOrderPizzasRequest: IOrderPizzasRequest = {
      orderPizzaRequests: [
        { pizzaId: 1, quantity: 2 },
        { pizzaId: 2, quantity: 1 },
        { pizzaId: 3, quantity: 2 },
      ]
    };

    // Act
    fixture.detectChanges();
    component.sendOrder();

    // Assert
    expect(cartServiceMock.getCounts).toHaveBeenCalled();
    expect(pizzaServiceMock.sendOrder).toHaveBeenCalledWith(expectedOrderPizzasRequest);
    expect(cartServiceMock.removeAllFromCart).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    expect(toasterServiceMock.open).toHaveBeenCalled();
  });

  it('should pop a toaster when the order fails', () => {
    // Arrange
    pizzaServiceMock.sendOrder.mockReturnValueOnce(throwError(() => new Error('Error')));
    const expectedOrderPizzasRequest: IOrderPizzasRequest = {
      orderPizzaRequests: [
        { pizzaId: 1, quantity: 2 },
        { pizzaId: 2, quantity: 1 },
        { pizzaId: 3, quantity: 2 },
      ]
    };

    // Act
    fixture.detectChanges();
    component.sendOrder();

    // Assert
    expect(cartServiceMock.getCounts).toHaveBeenCalled();
    expect(pizzaServiceMock.sendOrder).toHaveBeenCalledWith(expectedOrderPizzasRequest);
    expect(cartServiceMock.removeAllFromCart).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(toasterServiceMock.open).toHaveBeenCalled();
  });
});
