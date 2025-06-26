import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPizzaCardComponent } from './order-pizza-card.component';

describe('OrderPizzaCardComponent', () => {
  let component: OrderPizzaCardComponent;
  let fixture: ComponentFixture<OrderPizzaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPizzaCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPizzaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
