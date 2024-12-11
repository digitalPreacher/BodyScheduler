import { Component } from '@angular/core';
import { AuthorizationService } from '../../shared/authorization.service'
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/service/loading.service';

@Component({
  selector: 'app-forgot-user-password',
  templateUrl: './forgot-user-password.component.html',
  styles: ``
})
export class ForgotUserPasswordComponent {
  email: string = '';
  errorMessages: string[] = [];
  getErrorMessage = false;
  forgotPasswordForm: FormGroup;
  submittedClick: boolean = false;
  isLoading!: boolean;
  isLoadingDataSubscribtion: any;

  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private authService: AuthorizationService, private router: Router, private formBuilder: FormBuilder,
    private loadingService: LoadingService) {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    })
  }

  forgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.loadingService.show();
      this.authService.forgotUserPassword(this.forgotPasswordForm.value).subscribe({
        next: result => {
          this.loadingService.hide();
          this.router.navigate(['/login']);
          this.forgotPasswordForm.reset();
          this.submittedClick = false;

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
}
