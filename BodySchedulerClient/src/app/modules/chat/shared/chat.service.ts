import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  chatConnection!: signalR.HubConnection;
  startConnection = () => {
    this.chatConnection = new signalR.HubConnectionBuilder().withUrl('http://localhost:5292/chat').build();
    this.chatConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  //public async sendMessage(user: string, message: string) {
  //  await this.chatConnection.invoke('SendMessage', user, message);
  //}

  public async sendMessage(message: string) {
    await this.chatConnection.invoke('SendMessage', message);
  }

  public onReceiveMessage(callback: (message: string) => void) {
    this.chatConnection.on('ReceiveMessage', callback);
    console.log('message');
  }
}
