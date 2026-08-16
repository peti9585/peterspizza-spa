import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {Router, RouterLink} from '@angular/router';
import {IRegistrationData} from '../../../interfaces/interfaces-global';
import {AuthenticationService} from '../../../services/authentication.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  imports: [
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    MatFormField,
    RouterLink,
  ],
  selector: 'app-registration',
  styleUrl: './registration.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {
  reactiveForm: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    userName: FormControl<string>;
    email: FormControl<string>;
    phoneNumber: FormControl<string>;
    password: FormControl<string>;
  }>;

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthenticationService);
  private readonly toasterService = inject(MatSnackBar);
  private readonly router = inject(Router);

  constructor() {
    this.reactiveForm = this.formBuilder.nonNullable.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{7,}$')]],
      password: ['', Validators.required],
    });
  }

  private onSubmit() {
    if (this.reactiveForm.valid) {
      const registrationData: IRegistrationData = this.reactiveForm.value as IRegistrationData;

      this.authService.submitRegistration(registrationData).subscribe({
        next: (response) => {
          this.toasterService.open(
            'Sikeresen regisztráltál az oldalra!',
            'Bezár',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top'
            }
            );

          this.router.navigate(['/home']);
        },
        error: (error) => {
          if (error.status === 409) {
            this.toasterService.open(
              'A felhasználónév, telefonszám vagy e-mail cím már használatban van!',
              'Bezár',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top'
              }
              );
          } else {
            this.toasterService.open(
              'Hiba történt a regisztráció során!',
              'Bezár',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top'
              }
              );
          }
        }
      });
    }
  }

  onRegister() {
    this.onSubmit();
  }
}
