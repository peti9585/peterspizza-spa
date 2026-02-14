import { Component } from '@angular/core';
import {IncomingOrdersComponent} from '../incoming-orders/incoming-orders.component';

enum DashboardTab {
  Undefined,
  CurrentOrders,
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    IncomingOrdersComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  protected currentTab: DashboardTab = DashboardTab.CurrentOrders;

  protected readonly DashboardTab = DashboardTab;

  onSwitchToIncomingOrders() {
    this.currentTab = DashboardTab.Undefined;
  }
}
