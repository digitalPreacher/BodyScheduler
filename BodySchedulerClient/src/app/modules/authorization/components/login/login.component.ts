import { Component, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../../shared/user.model';
import { AuthorizationService } from '../../shared/authorization.service'
import { LoadingService } from '../../../shared/service/loading.service';
import { RegistrationService } from '../../../registration/shared/registration.service';
import { CookieService } from '../../../shared/service/cookie.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  model: User = new User();
  loginForm: FormGroup;

  isLoading!: boolean;
  isLoadingDataSubscribtion: any;
  errorMessage = '';
  submitted = false;
  submittedClick = false;

  constructor(private authService: AuthorizationService, private router: Router,
    private formBuilder: FormBuilder, private loadingService: LoadingService, private registrationServise: RegistrationService,
      private cookieService: CookieService) {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

    this.loginForm = this.formBuilder.group({
      login: [this.model.login, Validators.required],
      password: [this.model.password, Validators.required]
    });
  }

  //login to app
  login() {
    if (this.loginForm.valid) {
      this.loadingService.show();
      this.authService.login(this.loginForm.value).subscribe({
        next: result => {
          this.loadingService.hide();
          this.submitted = true;
          this.router.navigate([""]);
        },
        error: error => {
          this.loadingService.hide();
          this.errorMessage = error;
        }
      });
    }
  }

  ngOnDestroy() {
    this.isLoadingDataSubscribtion.unsubscribe();
  }
}
