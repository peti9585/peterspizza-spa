import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {ToastrService} from 'ngx-toastr';
import {IUpdateUserRequest} from '../../../interfaces/interfaces-global';

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
  styleUrl: './profile-data.component.css'
})
export class ProfileDataComponent {
  formGroup: FormGroup;
  isLoading: boolean = true;

  private readonly userService = inject(UserService);
  private readonly toasterService = inject(ToastrService);
  private readonly formBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.formBuilder.group({
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }]
    });
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
        this.toasterService.error('Hiba történt a kérés során.', 'Hiba');
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
        this.toasterService.success('Sikeresen frissítetted az adataid.');
      },
      error: (error) => {
        this.toasterService.error(`Hiba történt a kérés során: ${error.error.detail}`, 'Hiba');
      }
    });
  }
}
