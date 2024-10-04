import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInactivityService{

  private idleTimeout = 10000; 
  private idleTimer: any;
  private lastActivityTime: number = Date.now();

  idle$ = new BehaviorSubject<boolean>(false);

  startIdleTimer() {
    window.addEventListener('mousemove', () => this.resetIdleTimer());
    window.addEventListener('keypress', () => this.resetIdleTimer());

    this.idleTimer = setInterval(() => {
      const currentTime = Date.now();
      const idleTime = currentTime - this.lastActivityTime;
      if (idleTime >= this.idleTimeout) {
        this.idle$.next(true);
      }
    }, 1000);
  }

  resetIdleTimer() {
    this.lastActivityTime = Date.now();
  }
}
