import { Component, ViewChild } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationService } from '../../../registration/shared/registration.service';
import { debounceTime } from 'rxjs';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-success-alert',
  templateUrl: './success-alert.component.html',
  styles: ``
})
export class SuccessAlertComponent {

  isSuccess!: boolean;
  isSuccessSubscribtion: any;

  constructor(private alertService: AlertService) {
    this.isSuccessSubscribtion = this.alertService.isSuccessAlert$.subscribe(isSuccess => this.isSuccess = isSuccess);
  }

}
