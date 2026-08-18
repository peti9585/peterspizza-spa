import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ILoginData, LoginType} from '../../../interfaces/interfaces-global';
import {of, throwError} from 'rxjs';
import {AuthenticationService} from '../../../services/authentication.service';
import {MatSnackBar} from '@angular/material/snack-bar';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const activatedRouteMock = {
    snapshot: {
      params: {},
      queryParams: {}
    }
  };
  const authServiceMock = {
    submitLogin: vi.fn().mockName('submitLogin').mockReturnValue(of(null))
  };
  const routerMock = {
    navigate: vi.fn().mockName('navigate')
  }
  const toasterServiceMock = {
    open: vi.fn().mockName('open')
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: toasterServiceMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form when constructing the component', () => {
    // Arrange
    const form = component.reactiveForm;

    // Act
    fixture.detectChanges();

    // Assert
    expect(form).toBeTruthy();

    expect(form.get('userName')).toBeTruthy();
    expect(form.get('password')).toBeTruthy();

    expect(form.get('userName')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');

    expect(form.get('userName')?.valid).toBeFalsy();
    expect(form.get('password')?.valid).toBeFalsy();
  });

  it('should pass validation when providing valid inputs in the form', () => {
    // Arrange
    const form = component.reactiveForm;
    form.get('userName')?.setValue('Peter');
    form.get('password')?.setValue('123');

    // Act
    fixture.detectChanges();

    // Assert
    expect(form.valid).toBeTruthy();

  });

  it('should send login request in case of valid inputs', () => {
    // Arrange
    const expectedLoginRequest: ILoginData = {
      userName: 'peti9585',
      password: '123'
    };
    const form = component.reactiveForm;
    form.get('userName')?.setValue('peti9585');
    form.get('password')?.setValue('123');

    // Act
    fixture.detectChanges();
    component.onLogin();

    // Assert
    expect(authServiceMock.submitLogin).toHaveBeenCalledWith(expectedLoginRequest, component.loginType);
    expect(toasterServiceMock.open).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalled();
  });

  it('should navigate to user homepage in case login type is user', () => {
    // Arrange
    const form = component.reactiveForm;
    form.get('userName')?.setValue('peti9585');
    form.get('password')?.setValue('123');

    component.loginType = LoginType.User;

    // Act
    fixture.detectChanges();
    component.onLogin();

    // Assert
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should navigate to admin dashboard in case login type is admin', () => {
    // Arrange
    const form = component.reactiveForm;
    form.get('userName')?.setValue('peti9585');
    form.get('password')?.setValue('123');

    component.loginType = LoginType.Admin;

    // Act
    fixture.detectChanges();
    component.onLogin();

    // Assert
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should pop an error toaster in case login failed', () => {
    // Arrange
    const form = component.reactiveForm;
    form.get('userName')?.setValue('peti9585');
    form.get('password')?.setValue('123');

    authServiceMock.submitLogin.mockReturnValueOnce(throwError(() => new Error('Error')));

    // Act
    fixture.detectChanges();
    component.onLogin();

    // Assert
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(toasterServiceMock.open).toHaveBeenCalled();
  });
});
