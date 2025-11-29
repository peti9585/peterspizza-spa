import {inject, Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {AuthenticationService} from './authentication.service';
import {IOrderStatusChanged} from '../interfaces/interfaces-global';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: HubConnection;
  private orderStatusChangedSubject = new Subject<IOrderStatusChanged>();

  private readonly authService = inject(AuthenticationService);

  public orderStatusChanged$ = this.orderStatusChangedSubject.asObservable();

  public startConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5104/ordersHub', { accessTokenFactory: () => this.authService.getJwtToken() ?? ''})
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connection started'))
      .catch(err => console.log('Error establishing SignalR connection: ' + err));
  }

  public addMessageListener = () => {
    this.hubConnection.on('ReceiveOrderStatus', (orderId: string, orderState: number) => {
      this.orderStatusChangedSubject.next({orderId: orderId, newOrderState: orderState} as IOrderStatusChanged);
    });
  }

  public handleDisconnects = () => {
    this.hubConnection.onclose(() => {
      setTimeout(() => this.startConnection(), 3000);
    });
  }
}
