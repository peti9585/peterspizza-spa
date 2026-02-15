import {inject, Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {AuthenticationService} from './authentication.service';
import {Subject} from 'rxjs';
import {Admin} from '../interfaces/interfaces-global';
import IGetAllOrdersResponse = Admin.IGetAllOrdersResponse;
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalrAdminService {
  private hubConnection!: HubConnection;
  private adminOrdersChangedSubject = new Subject<IGetAllOrdersResponse>();

  private readonly authService = inject(AuthenticationService);

  public adminOrdersChanged$ = this.adminOrdersChangedSubject.asObservable();

  public startConnection = async() => {
    if (!this.hubConnection) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(environment.apiBaseUrl + '/adminHub', { accessTokenFactory: () => this.authService.getJwtToken() ?? ''})
        .build();
    }
    this.handleDisconnects();

    try {
      await this.hubConnection.start()
    } catch (err) {
      console.log('Error while establishing connection.');
    }
  }

  public addMessageListener = () => {
    if (!this.hubConnection) return;

    this.hubConnection.on('ReceiveOrderFromUser', (statusChanged: any) => {
      this.adminOrdersChangedSubject.next(statusChanged);
    });
  }

  public handleDisconnects = () => {
    if (!this.hubConnection) return;
    
    this.hubConnection.onclose(() => {
      setTimeout(() => this.startConnection(), 3000);
    });
  }
}
