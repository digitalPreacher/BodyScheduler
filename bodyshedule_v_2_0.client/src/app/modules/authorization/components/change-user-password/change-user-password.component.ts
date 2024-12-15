import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService } from '../../shared/authorization.service'
import { ChangeUserPasswordData } from '../../shared/change-user-password-data.model';
import { LoadingService } from '../../../shared/service/loading.service';
import { AlertService } from '../../../shared/service/alert.service';

@Component({
  selector: 'app-change-user-password',
  templateUrl: './change-user-password.component.html',
  styleUrl: './change-user-password.component.css',
})
export class ChangeUserPasswordComponent implements OnDestroy {
  model: ChangeUserPasswordData = new ChangeUserPasswordData();
  changeUserPasswordForm: FormGroup;
  confirmedPassword = '';
  confirmedPasswordResult: boolean = false;
  submittedClick: boolean = false;
  errorMessages: string[] = [];
  getErrorMessage = false;
  isLoading!: boolean;
  isLoadingDataSubscribtion: any;
  userDataSubscribtion: any;

  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  constructor(private authService: AuthorizationService, private formBuilder: FormBuilder, private loadingService: LoadingService,
  private alertService: AlertService)
  {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
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
      this.loadingService.show();
      if (this.changeUserPasswordForm.get('newPassword')?.value == this.confirmedPassword) {
        this.authService.changeUserPassword(this.changeUserPasswordForm.value).subscribe({
          next: result => {
            this.loadingService.hide();
            this.model = new ChangeUserPasswordData();
            this.changeUserPasswordForm.reset();
            this.confirmedPasswordResult = false;
            this.submittedClick = false;
            this.confirmedPassword = '';
            this.alertService.showSelfClosedSuccessAlert();
          },
          error: error => {
            this.loadingService.hide();
            this.getErrorMessage = true;
            this.confirmedPasswordResult = false;
            this.submittedClick = false;
            this.errorMessages.push(error);
          }
        })
      }
      else {
        this.confirmedPasswordResult = false;
        this.submittedClick = false;
      }
    }
  }

  ngOnDestroy() {
    this.isLoadingDataSubscribtion.unsubscribe();
    this.userDataSubscribtion.unsubscribe();
  }
}
