import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../../shared/user.model';
import { AuthorizationService } from '../../shared/authorization.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent{
  model: User = new User();
  loginForm: FormGroup;


  @Output() submitted = false;
  @Output() submittedClick = false;
  @Output() getErrorMessage = false;
  @Output() errorMessage = '';

  constructor(private authService: AuthorizationService, private router: Router, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      login: [this.model.login, Validators.required],
      password: [this.model.password, Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: result => {
          this.submitted = true;
          this.router.navigate([""]);
        },
        error: error => {
          this.getErrorMessage = true;
          this.errorMessage = error;
        }
      });
    }
  }
}
