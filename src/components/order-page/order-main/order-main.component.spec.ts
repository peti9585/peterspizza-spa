import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderMainComponent } from './order-main.component';
import {ActivatedRoute} from '@angular/router';
import {PizzaService} from '../../../services/pizza.service';
import {of} from 'rxjs';
import {IGetAllPizzasResponse} from '../../../interfaces/interfaces-global';
import {CartService} from '../../../services/cart.service';
import {CookieService} from 'ngx-cookie-service';
import {MatDialog} from '@angular/material/dialog';

describe('OrderMainComponent', () => {
  let component: OrderMainComponent;
  let fixture: ComponentFixture<OrderMainComponent>;

  const getAllPizzaDetails: IGetAllPizzasResponse = {
    getAllPizzasResponses: [
      { pizzaId: 1, pizzaName: 'Margherita', description: 'Temp description', pizzaImageBytes: '123' },
      { pizzaId: 2, pizzaName: 'Diavola', description: 'Temp description 2', pizzaImageBytes: '456' },
    ],
  };
  const getCountsResponse: Record<number, number> = {
    1: 2,
    2: 1
  };

  const activatedRouteMock = {
    snapshot: {
      params: {},
      queryParams: {}
    }
  };
  const pizzaServiceMock = {
    getAllPizzaDetails: vi.fn().mockName('getAllPizzaDetails').mockReturnValue(of(getAllPizzaDetails))
  };
  const cartServiceMock = {
    getCounts: vi.fn().mockName('getCounts').mockReturnValue(getCountsResponse),
    addToCart: vi.fn().mockName('addToCart')
  };
  const cookieServiceMock = {
    get: vi.fn().mockName('get').mockReturnValue('some cookie value')
  };
  const dialogMock = {
    open: vi.fn().mockName('open')
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderMainComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PizzaService, useValue: pizzaServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: CookieService, useValue: cookieServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderMainComponent);
    component = fixture.componentInstance;
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data on page load and set isLoading flag to false', () => {
    // Arrange
    const expectedComponentData: IGetAllPizzasResponse = {
      getAllPizzasResponses: [
        { pizzaId: 1, pizzaName: 'Margherita', description: 'Temp description', pizzaImageBytes: '123' },
        { pizzaId: 2, pizzaName: 'Diavola', description: 'Temp description 2', pizzaImageBytes: '456' },
      ],
    };

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.pizzas).toEqual(expectedComponentData);
    expect(component.isLoading).toBeFalsy();
  });

  it('should set isCartEmpty flag to false when it is not empty', () => {
    // Act + Assert
    fixture.detectChanges();

    expect(component.isCartEmpty).toBeFalsy();
  });

  it('should set isCartEmpty flag to true when it is empty', () => {
    // Arrange
    cartServiceMock.getCounts.mockReturnValueOnce({})

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.isCartEmpty).toBeTruthy();
  });

  it('should now show a dialog modal when cookie is set', () => {
    // Act + Assert
    fixture.detectChanges();

    expect(dialogMock.open).not.toHaveBeenCalled();
  });

  it('should show a dialog modal when cookie is not set', () => {
    // Arrange
    cookieServiceMock.get.mockReturnValueOnce('');

    // Act
    fixture.detectChanges();

    // Assert
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should handle addition to cart', () => {
    // Arrange
    const expectedGetCountsRequest: Record<number, number> = {
      1: 2,
      2: 2
    };

    // Act
    fixture.detectChanges();
    component.handleAddToCart(2);

    // Assert
    expect(cartServiceMock.addToCart).toHaveBeenCalledWith(expectedGetCountsRequest);
    expect(cartServiceMock.getCounts).toHaveBeenCalled();
    expect(component.isCartEmpty).toBeFalsy();
  });

  it('should handle addition to cart if initially it is empty', () => {
    // Arrange
    const emptyCounts: Record<number, number> = {};
    cartServiceMock.getCounts.mockReturnValue(emptyCounts);
    const expectedGetCountsRequest: Record<number, number> = { 2: 1 };

    // Act
    fixture.detectChanges();
    component.handleAddToCart(2);

    // Assert
    expect(cartServiceMock.addToCart).toHaveBeenCalledWith(expectedGetCountsRequest);
    expect(cartServiceMock.getCounts).toHaveBeenCalled();
    expect(component.isCartEmpty).toBeFalsy();
  });
});
