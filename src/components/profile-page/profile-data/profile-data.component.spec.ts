import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import {of, throwError} from 'rxjs';
import { ProfileDataComponent } from './profile-data.component';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {IGetUserDetailsByIdResponse, IUpdateUserRequest} from '../../../interfaces/interfaces-global';

describe('ProfileDataComponent', () => {
  let component: ProfileDataComponent;
  let fixture: ComponentFixture<ProfileDataComponent>;

  const userDetailsResponse: IGetUserDetailsByIdResponse = {
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+36201234567',
    email: 'john.doe@example.com',
  };

  const userServiceMock = {
    getUserDetailsById: vi.fn().mockName('getUserDetailsById').mockReturnValue(of(userDetailsResponse)),
    updateUser: vi.fn().mockName('updateUser').mockReturnValue(of({})),
  };

  const toasterMock = {
    open: vi.fn().mockName('open'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDataComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: MatSnackBar, useValue: toasterMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDataComponent);
    component = fixture.componentInstance;
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with default values', () => {
    // Act + Assert
    const form = component.formGroup;

    expect(form).toBeTruthy();

    expect(form.get('firstName')).toBeTruthy();
    expect(form.get('lastName')).toBeTruthy();
    expect(form.get('phoneNumber')).toBeTruthy();
    expect(form.get('email')).toBeTruthy();

    expect(form.get('firstName')?.value).toBe('');
    expect(form.get('lastName')?.value).toBe('');
    expect(form.get('phoneNumber')?.value).toBe('');
    expect(form.get('email')?.value).toBe('');
  });

  it('should fetch user data and fill the form and set isLoading flag to false', () => {
    // Arrange
    const form = component.formGroup;

    // Act
    fixture.detectChanges();

    // Assert
    expect(form.get('firstName')?.value).toBe('John');
    expect(form.get('lastName')?.value).toBe('Doe');
    expect(form.get('phoneNumber')?.value).toBe('+36201234567');
    expect(form.get('email')?.value).toBe('john.doe@example.com');

    expect(component.isLoading).toBeFalsy();
  });

  it('should open a toaster in case of error during initial fetch', () => {
    // Arrange
    const form = component.formGroup;
    userServiceMock.getUserDetailsById.mockReturnValueOnce(throwError(() => new Error('Error')));

    // Act
    fixture.detectChanges();

    // Assert
    expect(form.get('firstName')?.value).toBe('');
    expect(form.get('lastName')?.value).toBe('');
    expect(form.get('phoneNumber')?.value).toBe('');
    expect(form.get('email')?.value).toBe('');

    expect(toasterMock.open).toHaveBeenCalled();
  });

  it('should send user update request based on form values', () => {
    // Arrange
    const expectedRequest: IUpdateUserRequest = {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+36201234567',
      email: 'john.doe@example.com'
    };

    // Act
    fixture.detectChanges();
    component.sendUpdateRequest();

    // Assert
    expect(userServiceMock.updateUser).toHaveBeenCalledWith(expectedRequest);
    expect(toasterMock.open).toHaveBeenCalled();
  });
});
