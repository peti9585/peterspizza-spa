import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderMainComponent } from './order-main.component';
import {ActivatedRoute} from '@angular/router';
import {PizzaService} from '../../../services/pizza.service';
import {of} from 'rxjs';
import {IGetAllPizzasResponse} from '../../../interfaces/interfaces-global';

describe('OrderMainComponent', () => {
  let component: OrderMainComponent;
  let fixture: ComponentFixture<OrderMainComponent>;

  const getAllPizzaDetails: IGetAllPizzasResponse = {
    getAllPizzasResponses: [
      {
        pizzaId: 1,
        pizzaName: 'Margherita',
        description: 'Temp description',
        pizzaImageBytes: '123'
      },
    ],
  };

  const activatedRouteMock = {
    snapshot: {
      params: {},
      queryParams: {}
    }
  };
  const pizzaServiceMock = {
    getAll: vi.fn().mockName('getAll').mockReturnValue(''),
    getAllPizzaDetails: vi.fn().mockName('getAllPizzaDetails').mockReturnValue(of(getAllPizzaDetails))
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderMainComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PizzaService, useValue: pizzaServiceMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
