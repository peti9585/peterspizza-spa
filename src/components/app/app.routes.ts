import { Routes } from '@angular/router';
import {MainComponent} from '../main-page/main/main.component';
import {OrderMainComponent} from '../order-page/order-main/order-main.component';
import {NotfoundComponent} from '../notfound/notfound.component';
import {CartMainComponent} from '../cart-page/cart-main/cart-main.component';
import {
  PersonalDetailsMainComponent
} from '../personal-details-page/personal-details-main/personal-details-main.component';
import {RegistrationComponent} from '../registration-page/registration/registration.component';
import {LoginComponent} from '../login-page/login/login.component';

export const routes: Routes = [
  { path: 'home', component: MainComponent },
  { path: 'order', component: OrderMainComponent },
  { path: 'cart', component: CartMainComponent },
  { path: '404', component: NotfoundComponent },
  { path: 'order-confirmation', component: PersonalDetailsMainComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/404' }
];
