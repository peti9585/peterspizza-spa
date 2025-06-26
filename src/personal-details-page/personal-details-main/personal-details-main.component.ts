import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-personal-details-main',
  imports: [ReactiveFormsModule, MatInput, MatFormField, MatLabel, MatError, MatButton, RouterLink],
  templateUrl: './personal-details-main.component.html',
  styleUrl: './personal-details-main.component.css'
})
export class PersonalDetailsMainComponent {
  reactiveForm: FormGroup;

  private readonly formBuilder = inject(FormBuilder);

  constructor() {
    this.reactiveForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  onSubmit() {
    if (this.reactiveForm.valid) {
      console.log('Form submitted:', this.reactiveForm.value);
    } else {
      console.log('Form not valid');
    }
  }
}
