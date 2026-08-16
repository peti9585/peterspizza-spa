import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {MatDialog, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-info-modal',
  imports: [MatDialogTitle, MatButton],
  templateUrl: './info-modal.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './info-modal.component.css'
})
export class InfoModalComponent {
  private readonly dialog = inject(MatDialog);
  private readonly cookieService = inject(CookieService);

  onClick(): void {
    // Cookie for checking if the modal was closed, it will expire in 30 mins
    this.cookieService.set('infoModalClosed', 'true', 0.0208);

    this.dialog.closeAll();
  }
}
