import { Injectable } from "@angular/core";
import * as signalR from '@microsoft/signalr';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
     private hubConnection: signalR.HubConnection;

     public startConnection() {
        console.log('Starting SignalR connection');
        this.hubConnection = new signalR.HubConnectionBuilder()
         .withUrl('http://localhost:5114/NoticeboardHub')
         .build();

         this.hubConnection
           .start()
           .then(() => console.log('Connection started'))
           .catch(err => console.log('Error occured while starting a connection: ' + err))
     }

     public addReceiveMessageListener(callback: (sender: string, receiver: string, message: string, timestamp: Date) => void) {
        this.hubConnection.on('ReceiveMessage', callback);
   }
}