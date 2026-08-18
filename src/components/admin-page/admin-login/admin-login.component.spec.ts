import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { AdminLoginComponent } from './admin-login.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('AdminLoginComponent', () => {
  let component: AdminLoginComponent;
  let fixture: ComponentFixture<AdminLoginComponent>;

  const activatedRouteMock = {
    snapshot: { params: {}, queryParams: {} }
  };
  const authServiceMock = {
    submitLogin: vi.fn().mockName('submitLogin').mockReturnValue(of(null))
  };
  const routerMock = {
    navigate: vi.fn().mockName('navigate')
  };
  const toasterMock = {
    open: vi.fn().mockName('open')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLoginComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: toasterMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
