import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ResetPasswordData } from '../../shared/reset-password-data.model';
import { AuthorizationService } from '../../shared/authorization.service';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { AlertService } from '../../../shared/service/alert.service';

@Component({
  selector: 'app-reset-user-password',
  templateUrl: './reset-user-password.component.html',
  styles: ``
})
export class ResetUserPasswordComponent implements OnInit {

  resetPasswordData: ResetPasswordData = new ResetPasswordData();
  resetPasswordForm: FormGroup;
  confirmedPassword = '';

  submittedClick: boolean = false;
  getErrorMessage = false;
  errorMessages: string[] = [];
  confirmedPasswordResult: boolean = false;

  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private authService: AuthorizationService,
    private alertService: AlertService)
  {
    this.resetPasswordForm = this.formBuilder.group({
      token: [this.resetPasswordData.token],
      email: [this.resetPasswordData.email],
      password: ['', [Validators.required, Validators.minLength(6),
      Validators.maxLength(100), Validators.pattern(this.passwordRegex)]]
    })
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.resetPasswordData.token = params.get('token');
      this.resetPasswordData.email = params.get('email');
    });

    const codec = new HttpUrlEncodingCodec();
    if (this.resetPasswordData.token != null) {
      this.resetPasswordData.token = codec.decodeKey(this.resetPasswordData.token).replaceAll(' ', '+');
    }

    this.resetPasswordForm.patchValue({
      token: this.resetPasswordData.token,
      email: this.resetPasswordData.email,
    })

    if (this.resetPasswordData.token === null || this.resetPasswordData.email === null
      || this.resetPasswordData.token === '' || this.resetPasswordData.email === '') {
      this.router.navigate(['/login']);
    }
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      if (this.resetPasswordForm.get('password')?.value === this.confirmedPassword) {
        this.confirmedPasswordResult = true;
        console.log(this.resetPasswordForm.value);

        this.authService.resetUserPassword(this.resetPasswordForm.value).subscribe({
          next: result => {
            this.router.navigate(['/login']);
            this.submittedClick = false;
            this.resetPasswordForm.reset();
            this.alertService.showSelfClosedSuccessAlert();
          },
          error: error => {
            this.getErrorMessage = true;
            this.errorMessages = error;
          }
        })
      }
      else {
        this.confirmedPasswordResult = false;
      }
    }
  }

}

