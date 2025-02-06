import { Component, Output, Input } from '@angular/core';
import { inject } from '@angular/core';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { UserData } from '../../../authorization/shared/user-data.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  login: string = '';
  userDataSubscribtion: any;
  userRole = '';
  userData: UserData = new UserData();

  @Output() isLoggedIn: boolean = false;
  @Input() isSidebarCollapsed = true;
  @Input() isMobilePlatform = window.innerWidth < 450 ? true : false;

  constructor(private authService: AuthorizationService) {
    this.authService.userData$.asObservable().subscribe(data => {
      this.userData.isLoggedIn = data.isLoggedIn;
      this.userData.login = data.login;
      this.userData.role = data.role;
    })
  }

  //change collapsed state
  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  //logout from app
  logout() {
    this.authService.logout();
  }
}
