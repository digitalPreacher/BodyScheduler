import { Component } from '@angular/core';
import { ChatService } from '../../shared/chat.service'
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  userId: string = '';
  message: string = '';
  messages: string[] = [];
  isLoadedData: boolean = true;
  constructor(private chatComponent: ChatService, private httpClient: HttpClient, private authService: AuthorizationService)
  {
    this.authService.userData$.asObservable().subscribe({
      next: data => {
        this.userId = data.userId;
      },
      error: err => {
        console.log('err' + err);
      }
    })
  }

  ngOnInit() {
    this.chatComponent.startConnection();
    this.chatComponent.onReceiveMessage((message) => {
      this.isLoadedData = true;
      this.messages.push(message);
      console.log(message);
    });

    //this.httpClient.get('http://localhost:5292/api/ChatHub/GetMeassage').subscribe({
    //  next: data => {
    //    console.log('next 1' + data);
    //  },
    //  error: err => {
    //    console.log(err);
    //  }
    //})

  }

  btnClick() {
    this.isLoadedData = false;
    this.chatComponent.sendMessage(this.message);
    console.log(this.message);
  }
}
