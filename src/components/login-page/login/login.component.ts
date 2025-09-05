import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {Router, RouterLink} from '@angular/router';
import {ILoginData} from '../../../interfaces/interfaces-global';
import {ToastrService} from 'ngx-toastr';
import {AuthenticationService} from '../../../services/authentication.service';

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
  styleUrl: './login.component.css'
})
export class LoginComponent {
  reactiveForm: FormGroup;

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthenticationService);
  private readonly toasterService = inject(ToastrService);
  private readonly router = inject(Router);

  constructor() {
    this.reactiveForm = this.formBuilder.nonNullable.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  private onSubmit() {
    if (this.reactiveForm.valid) {
      const loginData: ILoginData = this.reactiveForm.value;

      this.authService.submitLogin(loginData).subscribe({
        next: (response) => {
          this.toasterService.success('Sikeresen bejelentkeztél az oldalra!', 'Sikeres bejelentkezés');

          this.router.navigate(['/home']);
        },
        error: (error) => {
            this.toasterService.error('Hiba történt a bejelentkezés során!', 'Hiba');
        }
      });
    }
  }

  onLogin() {
    this.onSubmit();
  }
}
