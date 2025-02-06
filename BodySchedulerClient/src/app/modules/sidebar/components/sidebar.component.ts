import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthorizationService } from '../../authorization/shared/authorization.service';
import { UserData } from '../../authorization/shared/user-data.model';

interface MenuItem {
  icon: string;
  label: string;
  children?: MenuItem[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isSidebarCollapsed = true;
  @Output() sidebarToggle = new EventEmitter<void>();
  @Input() isMobilePlatform = false;

  userData: UserData = new UserData();

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
