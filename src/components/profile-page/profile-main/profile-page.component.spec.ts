import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, Subject } from 'rxjs';
import { ProfilePageComponent } from './profile-page.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { PizzaService } from '../../../services/pizza.service';
import { SignalrService } from '../../../services/signalr.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IGetUserDetailsByIdResponse, IGetAllOrdersResponse } from '../../../interfaces/interfaces-global';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;

  const activatedRouteMock = {
    snapshot: { params: {}, queryParams: {} }
  };

  const userServiceMock = {
    getUserDetailsById: vi.fn().mockName('getUserDetailsById').mockReturnValue(of({
      firstName: 'John', lastName: 'Doe', phoneNumber: '123', email: 'a@b.com'
    } as IGetUserDetailsByIdResponse)),
    updateUser: vi.fn().mockName('updateUser').mockReturnValue(of({})),
  };

  const pizzaServiceMock = {
    getAllOrdersById: vi.fn().mockName('getAllOrdersById').mockReturnValue(of({
      getAllOrderResponses: []
    } as IGetAllOrdersResponse)),
  };

  const signalRServiceMock = {
    startConnection: vi.fn().mockName('startConnection').mockResolvedValue(undefined),
    addMessageListener: vi.fn().mockName('addMessageListener'),
    handleDisconnects: vi.fn().mockName('handleDisconnects'),
    orderStatusChanged$: new Subject(),
  };

  const toasterMock = {
    open: vi.fn().mockName('open'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: PizzaService, useValue: pizzaServiceMock },
        { provide: SignalrService, useValue: signalRServiceMock },
        { provide: MatSnackBar, useValue: toasterMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
