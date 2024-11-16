import { Component, Output } from '@angular/core';
import { inject } from '@angular/core';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  login: string = '';
  @Output() isLoggedIn: boolean = false;

  constructor(private authService: AuthorizationService) {
    this.authService.userData$.asObservable().subscribe(data => {
      this.isLoggedIn = data.isLoggedIn;
      this.login = data.login;
    })
  }

  logout() {
    this.authService.logout();
  }
}
