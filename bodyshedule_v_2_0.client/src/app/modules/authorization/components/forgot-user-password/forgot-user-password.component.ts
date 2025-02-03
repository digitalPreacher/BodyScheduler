import { Component, TemplateRef, inject, OnDestroy } from '@angular/core';
import { AuthorizationService } from '../../shared/authorization.service'
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/service/loading.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../shared/service/alert.service';

@Component({
  selector: 'app-forgot-user-password',
  templateUrl: './forgot-user-password.component.html',
  styles: ``
})
export class ForgotUserPasswordComponent implements OnDestroy  {
  email: string = '';
  errorMessages: string[] = [];
  getErrorMessage = false;
  forgotPasswordForm: FormGroup;
  submittedClick: boolean = false;
  isLoading!: boolean;
  isLoadingDataSubscribtion: any;

  modalService = inject(NgbModal);

  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private authService: AuthorizationService, private router: Router, private formBuilder: FormBuilder,
    private loadingService: LoadingService, private alertService: AlertService) {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    })
  }

  //forgot user password to login form
  forgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.loadingService.show();
      this.authService.forgotUserPassword(this.forgotPasswordForm.value).subscribe({
        next: result => {
          this.loadingService.hide();
          this.router.navigate(['/login']);
          this.forgotPasswordForm.reset();
          this.submittedClick = false;
          this.modalService.dismissAll();
          this.alertService.showSelfClosedSuccessAlert();
        },
        error: error => {
          this.loadingService.hide();
          this.getErrorMessage = true;
          this.errorMessages = error;
          this.submittedClick = false;
        }
      });
    }
  }

  //return default form fields
  setDefaultForgotPasswordForm() {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]]
    })
  }

  //reset reactive form
  resetForm() {
    this.getErrorMessage = false;
    this.errorMessages = [];
    const defaultForgotPasswordForm = this.setDefaultForgotPasswordForm();
    this.submittedClick = false;
    this.forgotPasswordForm = defaultForgotPasswordForm;
  }

  //open forgot password modal
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
