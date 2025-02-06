import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ElementRef } from '@angular/core'; 

import { AuthorizationService } from '../app/modules/authorization/shared/authorization.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit{
  userDataSubscribtion: any;
  isLoggedIn: any;
  isSidebarCollapsed = true;
  isMobilePlatform = window.innerWidth < 750 ? true : false;

  constructor(private authService: AuthorizationService, private elementRef: ElementRef) {
    if (localStorage.getItem('authToken')) {
      this.authService.setUserDetails();
    }

    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.isLoggedIn = data.isLoggedIn;
    });
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#121212';
  }

  //check mobile platform by window size 
  inputChangeWindowSize(size: any) {
    if (size.target.innerWidth < 750) {
      this.isMobilePlatform = true;
    }
    else {
      this.isMobilePlatform = false;
    }
  }
}
