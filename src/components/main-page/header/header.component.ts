import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatTooltipModule, RouterLink],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private readonly authService = inject(AuthenticationService);
  private readonly toasterService = inject(ToastrService);
  private readonly router = inject(Router);

  get isLoggedIn(): boolean {
    return this.authService.getJwtToken() !== null;
  }

  get userFirstName(): string | null {
    return this.isLoggedIn ? this.authService.getUserFirstName() : null;
  }

  logout() {
    this.authService.logout();
    this.toasterService.info('Sikeresen kijelentkeztél az oldalról.', 'Sikeres kijelentkezés');
    this.router.navigate(['/home']);
  }

}
