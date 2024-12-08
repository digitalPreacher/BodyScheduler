import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService } from '../../shared/authorization.service'
import { ChangeUserPasswordData } from '../../shared/change-user-password-data.model';

@Component({
  selector: 'app-change-user-password',
  templateUrl: './change-user-password.component.html',
  styleUrl: './change-user-password.component.css',
})
export class ChangeUserPasswordComponent {
  model: ChangeUserPasswordData = new ChangeUserPasswordData();
  changeUserPasswordForm: FormGroup;
  confirmedPassword = '';
  confirmedPasswordResult: boolean = false;
  submittedClick: boolean = false;
  errorMessages: string[] = [];
  getErrorMessage = false;

  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  constructor(private authService: AuthorizationService, private formBuilder: FormBuilder)
  {
    this.authService.userData$.asObservable().subscribe(data => {
      this.model.userLogin = data.login;
    })

    this.changeUserPasswordForm = this.formBuilder.group({
      userLogin: [this.model.userLogin, Validators.required],
      oldPassword: [this.model.oldPassword, Validators.required],
      newPassword: [this.model.newPassword, [Validators.required, Validators.minLength(6),
      Validators.maxLength(100), Validators.pattern(this.passwordRegex)]]
    });

  }

  changeUserPassword() {
    if (this.changeUserPasswordForm.valid) {
      if (this.changeUserPasswordForm.get('newPassword')?.value == this.confirmedPassword) {
        this.authService.changeUserPassword(this.changeUserPasswordForm.value).subscribe({
          next: result => {
            this.model = new ChangeUserPasswordData();
            this.changeUserPasswordForm.reset();
            this.confirmedPasswordResult = false;
            this.submittedClick = false;
            this.confirmedPassword = '';
          },
          error: error => {
            this.getErrorMessage = true;
            this.confirmedPasswordResult = false;
            this.submittedClick = false;
            this.errorMessages = error;
          }
        })
      }
      else {
        this.confirmedPasswordResult = false;
        this.submittedClick = false;
      }
    }
  }
}
