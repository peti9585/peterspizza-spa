import { Component } from '@angular/core';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {MatButton} from '@angular/material/button';
import {ProfileDataComponent} from '../profile-data/profile-data.component';
import {ProfileOrdersComponent} from '../profile-orders/profile-orders.component';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';

enum DrawerMode {
  ProfileData,
  Orders,
}

@Component({
  selector: 'app-profile-page',
  imports: [
    MatDrawerContainer,
    MatDrawer,
    MatDrawerContent,
    MatButton,
    ProfileDataComponent,
    ProfileOrdersComponent,
    MatToolbar,
    MatIcon,
    RouterLink
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  protected currentMode: DrawerMode = DrawerMode.ProfileData;
  protected readonly DrawerMode = DrawerMode;

  switchMode(mode: DrawerMode): void {
    this.currentMode = mode;
  }
}
