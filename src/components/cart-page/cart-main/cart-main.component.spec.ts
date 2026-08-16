import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartMainComponent } from './cart-main.component';
import {of, throwError} from 'rxjs';
import {IGetPizzasByIdsResponse} from '../../../interfaces/interfaces-global';
import {PizzaService} from '../../../services/pizza.service';
import {CartService} from '../../../services/cart.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

describe('CartMainComponent', () => {
  let component: CartMainComponent;
  let fixture: ComponentFixture<CartMainComponent>;

  const getPizzasByIdsResponse: IGetPizzasByIdsResponse = {
    getPizzaResponses: [
      { pizzaId: 1, pizzaName: 'Diavola', pizzaPrice: 7.0 },
      { pizzaId: 2, pizzaName: 'Margherita', pizzaPrice: 5.0 },
      { pizzaId: 3, pizzaName: 'Prosciutto Crudo', pizzaPrice: 8.5 },
    ]
  };
  const getCountsResponse: Record<number, number> = {
    1: 3,
    2: 2,
    3: 1
  };

  const pizzaServiceMock = {
    getPizzasByIds: vi.fn().mockName('getPizzasByIds').mockReturnValue(of(getPizzasByIdsResponse))
  };
  const cartServiceMock = {
    getCounts: vi.fn().mockName('getCounts').mockReturnValue(getCountsResponse),
    removeFromCart: vi.fn().mockName('removeFromCart'),
    increaseCount: vi.fn().mockName('increaseCount'),
    decreaseCount: vi.fn().mockName('decreaseCount'),
  };
  const routerMock = {
    navigate: vi.fn().mockName('navigate'),
  }
  const activatedRouteMock = {
    snapshot: {
      params: {},
      queryParams: {}
    }
  };
  const toasterServiceMock = {
    open: vi.fn().mockName('open')
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CartMainComponent
      ],
      providers: [
        { provide: PizzaService, useValue: pizzaServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: MatSnackBar, useValue: toasterServiceMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartMainComponent);
    component = fixture.componentInstance;
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all the pizza data when the page loads', () => {
    // Arrange
    const expectedPizzas = [
      {
        id: 1,
        name: 'Diavola',
        price: 7.0,
        quantity: 3,
        totalPrice: 21.0,
      },
      {
        id: 2,
        name: 'Margherita',
        price: 5.0,
        quantity: 2,
        totalPrice: 10.0,
      },
      {
        id: 3,
        name: 'Prosciutto Crudo',
        price: 8.5,
        quantity: 1,
        totalPrice: 8.5,
      },
    ];

    // Act
    fixture.detectChanges();

    // Assert
    expect(cartServiceMock.getCounts).toHaveBeenCalled();
    expect(pizzaServiceMock.getPizzasByIds).toHaveBeenCalledWith([1, 2, 3]);
    expect(component.dataSource).toEqual(expectedPizzas);
  });

  it('should pop a toaster when an error happens during fetch', () => {
    // Arrange
    pizzaServiceMock.getPizzasByIds.mockReturnValueOnce(throwError(() => new Error('Error')));

    // Act
    fixture.detectChanges();

    // Assert
    expect(cartServiceMock.getCounts).toHaveBeenCalled();
    expect(pizzaServiceMock.getPizzasByIds).toHaveBeenCalledWith([1, 2, 3]);
    expect(toasterServiceMock.open).toHaveBeenCalled();
    expect(component.isLoading).toBeTruthy();
    expect(component.dataSource).toEqual([]);
  });

  it('should set isLoading to false after page loads', () => {
    // Act + Assert
    expect(component.isLoading).toBeTruthy();

    fixture.detectChanges();

    expect(component.isLoading).toBeFalsy();
  });

  it('calculates overall price when the page loads', () => {
    // Arrange
    const expectedOverallPrice = 39.5;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.overallPrice).toEqual(expectedOverallPrice);
  });

  it('should remove an item from the collection and re-calculate overall price', () => {
    // Arrange
    const expectedFilteredData = [
      {
        id: 2,
        name: 'Margherita',
        price: 5.0,
        quantity: 2,
        totalPrice: 10.0,
      },
      {
        id: 3,
        name: 'Prosciutto Crudo',
        price: 8.5,
        quantity: 1,
        totalPrice: 8.5,
      },
    ];
    const expectedOverallPrice = 18.5;

    // Act
    fixture.detectChanges();
    component.removeItem(1);

    // Assert
    expect(component.dataSource).toEqual(expectedFilteredData);
    expect(cartServiceMock.removeFromCart).toHaveBeenCalled();
    expect(component.overallPrice).toEqual(expectedOverallPrice);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should navigate back to the order page if the basket is empty', () => {
    // Act + Assert
    fixture.detectChanges();
    component.removeItem(1);
    component.removeItem(2);
    component.removeItem(3);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/order']);
  });

  it('should increase the quantity', () => {
    // Arrange
    const expectedFilteredData = [
      {
        id: 1,
        name: 'Diavola',
        price: 7.0,
        quantity: 4,
        totalPrice: 28.0,
      },
      {
        id: 2,
        name: 'Margherita',
        price: 5.0,
        quantity: 2,
        totalPrice: 10.0,
      },
      {
        id: 3,
        name: 'Prosciutto Crudo',
        price: 8.5,
        quantity: 1,
        totalPrice: 8.5,
      },
    ];
    const expectedOverallPrice = 46.5;

    // Act
    fixture.detectChanges();
    component.increaseQuantity(1);

    // Assert
    expect(cartServiceMock.increaseCount).toHaveBeenCalledWith(1);
    expect(component.dataSource).toEqual(expectedFilteredData);
    expect(component.overallPrice).toEqual(expectedOverallPrice);
  });

  it('should decrease the quantity', () => {
    // Arrange
    const expectedFilteredData = [
      {
        id: 1,
        name: 'Diavola',
        price: 7.0,
        quantity: 2,
        totalPrice: 14.0,
      },
      {
        id: 2,
        name: 'Margherita',
        price: 5.0,
        quantity: 2,
        totalPrice: 10.0,
      },
      {
        id: 3,
        name: 'Prosciutto Crudo',
        price: 8.5,
        quantity: 1,
        totalPrice: 8.5,
      },
    ];
    const expectedOverallPrice = 32.5;

    // Act
    fixture.detectChanges();
    component.decreaseQuantity(1);

    // Assert
    expect(cartServiceMock.decreaseCount).toHaveBeenCalledWith(1);
    expect(component.dataSource).toEqual(expectedFilteredData);
    expect(component.overallPrice).toEqual(expectedOverallPrice);
  });

  it('should not decrease the quantity when it is already at threshold', () => {
    // Arrange
    const expectedFilteredData = [
      {
        id: 1,
        name: 'Diavola',
        price: 7.0,
        quantity: 3,
        totalPrice: 21.0,
      },
      {
        id: 2,
        name: 'Margherita',
        price: 5.0,
        quantity: 2,
        totalPrice: 10.0,
      },
      {
        id: 3,
        name: 'Prosciutto Crudo',
        price: 8.5,
        quantity: 1,
        totalPrice: 8.5,
      },
    ];
    const expectedOverallPrice = 39.5;

    // Act
    fixture.detectChanges();
    component.decreaseQuantity(3); // ID 3 is already at count 1, cannot be decreased further

    // Assert
    expect(cartServiceMock.decreaseCount).not.toHaveBeenCalled();
    expect(component.dataSource).toEqual(expectedFilteredData);
    expect(component.overallPrice).toEqual(expectedOverallPrice);
  });
});
