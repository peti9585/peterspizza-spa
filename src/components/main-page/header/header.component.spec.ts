import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import {AuthenticationService} from '../../../services/authentication.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const authServiceMock = {
    logout: vi.fn().mockName('logout'),
    getJwtToken: vi.fn().mockName('getJwtToken').mockReturnValue('jwt'),
    getUserFirstName: vi.fn().mockName('getUserFirstName').mockReturnValue('Peter')
  };
  const toasterServiceMock = {
    open: vi.fn().mockName('open')
  };
  const routerMock = {
    navigate: vi.fn().mockName('navigate')
  };
  const activatedRouteMock = {
    snapshot: {
      params: {},
      queryParams: {}
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: MatSnackBar, useValue: toasterServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log out properly', () => {
    // Act + Assert
    fixture.detectChanges();
    component.logout();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(toasterServiceMock.open).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });
});
