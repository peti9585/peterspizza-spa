import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {Router, RouterLink} from '@angular/router';
import {IRegistrationData} from '../../../interfaces/interfaces-global';
import {ToastrService} from 'ngx-toastr';
import {AuthenticationService} from '../../../services/authentication.service';

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
  private readonly toasterService = inject(ToastrService);
  private readonly router = inject(Router);

  constructor() {
    this.reactiveForm = this.formBuilder.nonNullable.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', Validators.required],
    });
  }

  private onSubmit() {
    if (this.reactiveForm.valid) {
      const registrationData: IRegistrationData = this.reactiveForm.value as IRegistrationData;

      this.authService.submitRegistration(registrationData).subscribe({
        next: (response) => {
          this.toasterService.success('Sikeresen regisztráltál az oldalra!', 'Sikeres regisztráció');

          this.router.navigate(['/home']);
        },
        error: (error) => {
          if (error.status === 409) {
            this.toasterService.info('A felhasználónév, telefonszám vagy e-mail cím már használatban van!', 'Hiba');
          } else {
            this.toasterService.error('Hiba történt a regisztráció során!', 'Hiba');
          }
        }
      });
    } else {
      console.log('Form not valid');
    }
  }

  onRegister() {
    this.onSubmit();
  }
}
