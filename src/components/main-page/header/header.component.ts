import {Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatTooltipModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private readonly authService = inject(AuthenticationService);
  private readonly router = inject(Router);

  constructor() {
    console.log('logged in? ' + this.isLoggedIn);
  }

  get isLoggedIn(): boolean {
    return this.authService.getToken() !== null;
  }

  get userFirstName(): string | null {
    return this.isLoggedIn ? this.authService.getUserFirstName() : null;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

}
