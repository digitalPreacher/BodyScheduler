import { Component, OnDestroy, Output, TemplateRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RegistrationData } from '../../shared/registration-data.model';
import { RegistrationService } from '../../shared/registration.service';
import { LoadingService } from '../../../shared/service/loading.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject } from 'rxjs';
import { AlertService } from '../../../shared/service/alert.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: ``
})
export class RegistrationComponent implements OnDestroy {
  registrationForm: FormGroup;
  confirmedPassword = '';

  submittedClick: boolean = false;
  getErrorMessage = false;
  errorMessage: string = '';
  getErrorMessages = false;
  errorMessages: any[] = [];
  confirmedPasswordResult: boolean = false;

  isLoading!: boolean;
  isLoadingDataSubscribtion: any;

  modalService = inject(NgbModal);


  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

  constructor(private registrationService: RegistrationService, private router: Router,
    private formBuilder: FormBuilder, private loadingService: LoadingService, private alertService: AlertService)
  {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

    this.registrationForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6),
        Validators.maxLength(100), Validators.pattern(this.passwordRegex)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      acceptedAgreement: ['', Validators.required]
    });
  }

  registration() {
    if (this.registrationForm.valid) {
      if (this.registrationForm.get('password')?.value == this.confirmedPassword) {
        this.loadingService.show();
        this.confirmedPasswordResult = true;
        this.registrationService.registration(this.registrationForm.value).subscribe({
          next: result => {
            this.loadingService.hide();
            this.router.navigate(['/login']);
            this.modalService.dismissAll();
            this.alertService.showSelfClosedSuccessAlert();
          },
          error: error => {
            this.loadingService.hide();
            this.getErrorMessages = true;
            this.errorMessages = error
            
          }
        });
      }
      else {
        this.confirmedPasswordResult = false;
      }
    }
  }

  //return default form fields
  setDefaultRegistrationForm() {
    return this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6),
      Validators.maxLength(100), Validators.pattern(this.passwordRegex)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      acceptedAgreement: ['', Validators.required]
    })
  }

  //reset reactive form
  resetForm() {
    const defaultRegistrationForm = this.setDefaultRegistrationForm();
    this.submittedClick = false;
    this.registrationForm = defaultRegistrationForm;
  }

  open(content: TemplateRef<any>) {
    const options: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title'
    };
    this.resetForm();
    this.modalService.open(content, options);
  }

  ngOnDestroy() {
    this.isLoadingDataSubscribtion.unsubscribe();
  }
}
