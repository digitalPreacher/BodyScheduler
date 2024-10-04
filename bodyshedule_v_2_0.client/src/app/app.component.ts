import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'; 
import { AuthorizationService } from '../app/modules/authorization/shared/authorization.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private authService: AuthorizationService) {
    if (localStorage.getItem('authToken')) {
      this.authService.setUserDetails();
    }
  }
}
