import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInactivityService } from '../../../authorization/shared/user-inactivity.service'
import { AuthorizationService } from '../../../authorization/shared/authorization.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthorizationService, private inactivityService: UserInactivityService) { }

  ngOnInit() {
    this.inactivityService.startIdleTimer();
    this.inactivityService.idle$.subscribe(inactivity => {
      if (inactivity) {
        this.authService.logout();
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
