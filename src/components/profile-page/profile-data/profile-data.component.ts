import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {IUpdateUserRequest} from '../../../interfaces/interfaces-global';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-data',
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatProgressSpinner
  ],
  templateUrl: './profile-data.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './profile-data.component.css'
})
export class ProfileDataComponent {
  formGroup: FormGroup;
  isLoading: boolean = true;

  private readonly userService = inject(UserService);
  private readonly toasterService = inject(MatSnackBar);
  private readonly formBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }]
    });
  }

  ngOnInit() {
    this.userService.getUserDetailsById().subscribe({
      next: (response) => {
        this.formGroup.patchValue({
            firstName: response.firstName,
            lastName: response.lastName,
            phoneNumber: response.phoneNumber,
            email: response.email
          }
        );
        this.formGroup.enable();
        this.isLoading = false;
      },
      error: (_) => {
        this.toasterService.open(
          'Hiba történt a kérés során.',
          'Bezár',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
        );
        this.isLoading = false;
      }
    });
  }

  sendUpdateRequest() {
    const request = {
      firstName: this.formGroup.get('firstName')!.value,
      lastName: this.formGroup.get('lastName')!.value,
      phoneNumber: this.formGroup.get('phoneNumber')!.value,
      email: this.formGroup.get('email')!.value
    } as IUpdateUserRequest

    this.userService.updateUser(request).subscribe({
      next: (_) => {
        this.toasterService.open(
          'Sikeresen frissítetted az adataid.',
          '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: ['success-snackbar']
          }
          );
      },
      error: (error) => {
        this.toasterService.open(
          `Hiba történt a kérés során!`,
          'Bezár',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
          );
      }
    });
  }
}
