import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatTooltipModule, RouterLink],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private readonly authService = inject(AuthenticationService);
  private readonly toasterService = inject(MatSnackBar);
  private readonly router = inject(Router);

  get isLoggedIn(): boolean {
    return this.authService.getJwtToken() !== null;
  }

  get userFirstName(): string | null {
    return this.isLoggedIn ? this.authService.getUserFirstName() : null;
  }

  logout() {
    this.authService.logout();
    this.toasterService.open(
      'Sikeresen kijelentkeztél az oldalról.',
      'Bezár',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
      );
    this.router.navigate(['/home']);
  }

}
