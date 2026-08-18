import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPizzaCardComponent } from './order-pizza-card.component';
import {CartService} from '../../../services/cart.service';

describe('OrderPizzaCardComponent', () => {
  let component: OrderPizzaCardComponent;
  let fixture: ComponentFixture<OrderPizzaCardComponent>;

  const getCountsResponse: Record<number, number> = {
    1: 1,
    2: 1
  };

  const cartServiceMock = {
    getCounts: vi.fn().mockName('getCounts').mockReturnValue(getCountsResponse),
    increaseCount: vi.fn().mockName('increaseCount'),
    decreaseCount: vi.fn().mockName('decreaseCount'),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPizzaCardComponent],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPizzaCardComponent);
    component = fixture.componentInstance;

    component.pizzaDetail = {
      pizzaId: 1,
      pizzaName: 'Margherita',
      description: 'Temp description',
      pizzaImageBytes: '123'
    };

    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increase cart count', () => {
    // Act + Assert
    fixture.detectChanges();
    component.increase();

    expect(cartServiceMock.increaseCount).toHaveBeenCalledWith(1);
  });

  it('should decrease cart count', () => {
    // Act + Assert
    fixture.detectChanges();
    component.decrease();

    expect(cartServiceMock.decreaseCount).toHaveBeenCalledWith(1);
  });

  it('should not decrease cart count when cart count is zero', () => {
    // Arrange
    const getCountsResponse: Record<number, number> = {};
    cartServiceMock.getCounts.mockReturnValue(getCountsResponse);

    // Act
    fixture.detectChanges();
    component.decrease();

    // Assert
    expect(cartServiceMock.decreaseCount).not.toHaveBeenCalled();
  });

  it('should truncate long text', () => {
    // Arrange
    component.pizzaDetail.description = 'H1aM$2zq(06Bx*3878VL_+}@B(WqR6FVRDq(?U+pEhjXZbP%{ZC0gF*ruF:a!-B;nFqQPem';

    // Act
    fixture.detectChanges();
    const truncated = component.truncatedText;

    // Assert
    expect(truncated.endsWith('...')).toBeTruthy();
  });

  it('should not truncate normal text', () => {
    // Arrange
    component.pizzaDetail.description = 'Temp description';

    // Act
    fixture.detectChanges();
    const normalText = component.truncatedText;

    // Assert
    expect(normalText).not.contain('...');
  })
});
