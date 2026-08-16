import { Component, ChangeDetectionStrategy } from '@angular/core';
import {LoginComponent} from '../../login-page/login/login.component';
import {LoginType} from '../../../interfaces/interfaces-global';

@Component({
  selector: 'app-admin-login',
  imports: [
    LoginComponent
  ],
  templateUrl: './admin-login.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  protected readonly LoginType = LoginType;
}
