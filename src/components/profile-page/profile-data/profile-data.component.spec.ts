import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { ProfileDataComponent } from './profile-data.component';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IGetUserDetailsByIdResponse } from '../../../interfaces/interfaces-global';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
