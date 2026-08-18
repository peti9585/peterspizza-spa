import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { RegistrationComponent } from './registration.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IRegistrationData } from '../../../interfaces/interfaces-global';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  const activatedRouteMock = {
    snapshot: { params: {}, queryParams: {} }
  };
  const authServiceMock = {
    submitRegistration: vi.fn().mockName('submitRegistration').mockReturnValue(of(null))
  };
  const routerMock = {
    navigate: vi.fn().mockName('navigate')
  };
  const toasterMock = {
    open: vi.fn().mockName('open')
  };

  const validFormValues = {
    firstName: 'Peter',
    lastName: 'Kis',
    userName: 'peti9585',
    email: 'peter@example.com',
    phoneNumber: '0912345678',
    password: 'password123',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: toasterMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should initialize all fields with empty values', () => {
      const form = component.reactiveForm;

      expect(form.get('firstName')?.value).toBe('');
      expect(form.get('lastName')?.value).toBe('');
      expect(form.get('userName')?.value).toBe('');
      expect(form.get('email')?.value).toBe('');
      expect(form.get('phoneNumber')?.value).toBe('');
      expect(form.get('password')?.value).toBe('');
    });

    it('should initialize form as invalid', () => {
      expect(component.reactiveForm.valid).toBeFalsy();
    });
  });

  describe('form validation', () => {
    it('should require firstName', () => {
      component.reactiveForm.get('firstName')?.setValue('');

      expect(component.reactiveForm.get('firstName')?.valid).toBeFalsy();
    });

    it('should require lastName', () => {
      component.reactiveForm.get('lastName')?.setValue('');

      expect(component.reactiveForm.get('lastName')?.valid).toBeFalsy();
    });

    it('should require userName', () => {
      component.reactiveForm.get('userName')?.setValue('');

      expect(component.reactiveForm.get('userName')?.valid).toBeFalsy();
    });

    it('should require email', () => {
      component.reactiveForm.get('email')?.setValue('');

      expect(component.reactiveForm.get('email')?.valid).toBeFalsy();
    });

    it('should reject an invalid email format', () => {
      component.reactiveForm.get('email')?.setValue('not-an-email');

      expect(component.reactiveForm.get('email')?.valid).toBeFalsy();
    });

    it('should accept a valid email', () => {
      component.reactiveForm.get('email')?.setValue('user@example.com');

      expect(component.reactiveForm.get('email')?.valid).toBeTruthy();
    });

    it('should require phoneNumber', () => {
      component.reactiveForm.get('phoneNumber')?.setValue('');

      expect(component.reactiveForm.get('phoneNumber')?.valid).toBeFalsy();
    });

    it('should reject a phoneNumber shorter than 7 digits', () => {
      component.reactiveForm.get('phoneNumber')?.setValue('123456');

      expect(component.reactiveForm.get('phoneNumber')?.valid).toBeFalsy();
    });

    it('should reject a phoneNumber containing non-digit characters', () => {
      component.reactiveForm.get('phoneNumber')?.setValue('+36201234567');

      expect(component.reactiveForm.get('phoneNumber')?.valid).toBeFalsy();
    });

    it('should accept a valid phoneNumber of 7+ digits', () => {
      component.reactiveForm.get('phoneNumber')?.setValue('1234567');

      expect(component.reactiveForm.get('phoneNumber')?.valid).toBeTruthy();
    });

    it('should require password', () => {
      component.reactiveForm.get('password')?.setValue('');

      expect(component.reactiveForm.get('password')?.valid).toBeFalsy();
    });

    it('should be valid when all fields are filled correctly', () => {
      component.reactiveForm.setValue(validFormValues);

      expect(component.reactiveForm.valid).toBeTruthy();
    });
  });

  describe('onRegister', () => {
    it('should not call submitRegistration when form is invalid', () => {
      component.onRegister();

      expect(authServiceMock.submitRegistration).not.toHaveBeenCalled();
    });

    it('should send registration request with form data when form is valid', () => {
      // Arrange
      const expectedRequest: IRegistrationData = { ...validFormValues };
      component.reactiveForm.setValue(validFormValues);

      // Act
      component.onRegister();

      // Assert
      expect(authServiceMock.submitRegistration).toHaveBeenCalledWith(expectedRequest);
    });

    it('should show a success toaster on successful registration', () => {
      // Arrange
      component.reactiveForm.setValue(validFormValues);

      // Act
      component.onRegister();

      // Assert
      expect(toasterMock.open).toHaveBeenCalledWith(
        'Sikeresen regisztráltál az oldalra!',
        'Bezár',
        expect.objectContaining({ horizontalPosition: 'center', verticalPosition: 'top' })
      );
    });

    it('should navigate to /home on successful registration', () => {
      // Arrange
      component.reactiveForm.setValue(validFormValues);

      // Act
      component.onRegister();

      // Assert
      expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should show a conflict toaster on 409 error', () => {
      // Arrange
      const error = { status: 409 };
      authServiceMock.submitRegistration.mockReturnValueOnce(throwError(() => error));
      component.reactiveForm.setValue(validFormValues);

      // Act
      component.onRegister();

      // Assert
      expect(toasterMock.open).toHaveBeenCalledWith(
        'A felhasználónév, telefonszám vagy e-mail cím már használatban van!',
        'Bezár',
        expect.objectContaining({ horizontalPosition: 'center', verticalPosition: 'top' })
      );
    });

    it('should show a generic error toaster on non-409 errors', () => {
      // Arrange
      const error = { status: 500 };
      authServiceMock.submitRegistration.mockReturnValueOnce(throwError(() => error));
      component.reactiveForm.setValue(validFormValues);

      // Act
      component.onRegister();

      // Assert
      expect(toasterMock.open).toHaveBeenCalledWith(
        'Hiba történt a regisztráció során!',
        'Bezár',
        expect.objectContaining({ horizontalPosition: 'center', verticalPosition: 'top' })
      );
    });

    it('should not navigate on error', () => {
      // Arrange
      authServiceMock.submitRegistration.mockReturnValueOnce(throwError(() => ({ status: 500 })));
      component.reactiveForm.setValue(validFormValues);

      // Act
      component.onRegister();

      // Assert
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });
});
