import {inject, Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {AuthenticationService} from './authentication.service';
import {Subject} from 'rxjs';
import {Admin} from '../interfaces/interfaces-global';
import IGetAllOrdersResponse = Admin.IGetAllOrdersResponse;

@Injectable({
  providedIn: 'root'
})
export class SignalrAdminService {
  private hubConnection!: HubConnection;
  private adminOrdersChangedSubject = new Subject<IGetAllOrdersResponse>();

  private readonly authService = inject(AuthenticationService);

  public adminOrdersChanged$ = this.adminOrdersChangedSubject.asObservable();

  public startConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5104/adminHub', { accessTokenFactory: () => this.authService.getJwtToken() ?? ''})
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connection started'))
      .catch(err => console.log('Error establishing SignalR connection: ' + err));
  }

  public addMessageListener = () => {
    this.hubConnection.on('ReceiveOrderFromUser', (statusChanged: any) => {
      this.adminOrdersChangedSubject.next(statusChanged);
    });
  }

  public handleDisconnects = () => {
    this.hubConnection.onclose(() => {
      setTimeout(() => this.startConnection(), 3000);
    });
  }
}
