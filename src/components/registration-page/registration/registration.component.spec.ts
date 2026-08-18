import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { RegistrationComponent } from './registration.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
