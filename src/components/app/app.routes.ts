import { Routes } from '@angular/router';
import {MainComponent} from '../main-page/main/main.component';
import {OrderMainComponent} from '../order-page/order-main/order-main.component';
import {NotfoundComponent} from '../notfound/notfound.component';
import {CartMainComponent} from '../cart-page/cart-main/cart-main.component';
import {RegistrationComponent} from '../registration-page/registration/registration.component';
import {LoginComponent} from '../login-page/login/login.component';
import {authGuard, authGuardForAdmin} from '../../guards/auth.guard';
import {ProfilePageComponent} from '../profile-page/profile-main/profile-page.component';
import {AdminLoginComponent} from '../admin-page/admin-login/admin-login.component';
import {AdminDashboardComponent} from '../admin-page/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: 'home', component: MainComponent },
  { path: 'order', component: OrderMainComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartMainComponent, canActivate: [authGuard] },
  { path: '404', component: NotfoundComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard] },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [authGuardForAdmin] },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/404' }
];
