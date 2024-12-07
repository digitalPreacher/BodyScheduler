import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core'; 

import { AuthorizationService } from '../app/modules/authorization/shared/authorization.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit{

  constructor(private authService: AuthorizationService, private elementRef: ElementRef) {
    if (localStorage.getItem('authToken')) {
      this.authService.setUserDetails();
    }
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument
      .body.style.backgroundColor = '#121212';
  }
}
