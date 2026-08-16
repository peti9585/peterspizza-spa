import {Component, inject, Input, ChangeDetectionStrategy} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {Router, RouterLink} from '@angular/router';
import {ILoginData, LoginType} from '../../../interfaces/interfaces-global';
import {AuthenticationService} from '../../../services/authentication.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Input() loginType: LoginType = LoginType.User;

  reactiveForm: FormGroup;

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthenticationService);
  private readonly toasterService = inject(MatSnackBar);
  private readonly router = inject(Router);

  constructor() {
    this.reactiveForm = this.formBuilder.nonNullable.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    this.onSubmit()
  }

  private onSubmit() {
    if (this.reactiveForm.valid) {
      const loginData: ILoginData = this.reactiveForm.value;

      this.authService.submitLogin(loginData, this.loginType).subscribe({
        next: (_) => {
          this.toasterService.open(
            'Sikeresen bejelentkeztél az oldalra!',
            'Bezár',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top'
            }
            );

          this.loginType === LoginType.User
            ? this.router.navigate(['/home'])
            : this.router.navigate(['/admin/dashboard']);
        },
        error: (_) => {
            this.toasterService.open(
              'Hiba történt a bejelentkezés során!',
              'Bezár',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top'
              }
              );
        }
      });
    }
  }
}
