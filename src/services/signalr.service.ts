import {inject, Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {AuthenticationService} from './authentication.service';
import {IOrderStatusChanged} from '../interfaces/interfaces-global';
import {Subject} from 'rxjs';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: HubConnection;
  private orderStatusChangedSubject = new Subject<IOrderStatusChanged>();

  private readonly authService = inject(AuthenticationService);

  public orderStatusChanged$ = this.orderStatusChangedSubject.asObservable();

  public startConnection = async() => {
    if (!this.hubConnection) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(environment.apiBaseUrl + '/ordersHub', { accessTokenFactory: () => this.authService.getJwtToken() ?? ''})
        .build();
    }
    this.handleDisconnects();

    try {
      await this.hubConnection.start();
    } catch (err) {
      console.log('Error while establishing connection.');
    }
  }

  public addMessageListener = () => {
    if (!this.hubConnection) return;

    this.hubConnection.on('ReceiveOrderStatus', (statusChanged: IOrderStatusChanged) => {
      this.orderStatusChangedSubject.next(statusChanged);
    });
  }

  public handleDisconnects = () => {
    if (!this.hubConnection) return;

    this.hubConnection.onclose(() => {
      setTimeout(() => this.startConnection(), 3000);
    });
  }
}
