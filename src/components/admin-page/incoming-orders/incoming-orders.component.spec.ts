import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingOrdersComponent } from './incoming-orders.component';

describe('IncomingOrdersComponent', () => {
  let component: IncomingOrdersComponent;
  let fixture: ComponentFixture<IncomingOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
