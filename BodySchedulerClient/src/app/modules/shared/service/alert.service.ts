import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  delayBeforeClosedAlert = 3000
  private _isSuccessAlert = new BehaviorSubject<boolean>(false);
  public readonly isSuccessAlert$ = this._isSuccessAlert.asObservable();

  constructor() { }

  //show self closed alert
  showSelfClosedSuccessAlert() {
    this._isSuccessAlert.next(true);
    this.selfClosedSuccessAlert();
  }

  //self cloased alert with delay
  selfClosedSuccessAlert() {
    setTimeout(() => this._isSuccessAlert.next(false), this.delayBeforeClosedAlert);
  }

}
