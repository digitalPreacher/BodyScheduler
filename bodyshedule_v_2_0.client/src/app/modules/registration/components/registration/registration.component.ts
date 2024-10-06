import { Component, Output } from '@angular/core';
import { RegistrationService } from '../../shared/registration.service';
import { RegistrationData } from '../../shared/registration-data.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: ``
})
export class RegistrationComponent {
  model: RegistrationData = new RegistrationData();
  registrationForm: FormGroup;
  confirmedPassword = '';
  @Output() submittedClick: boolean = false;
  @Output() getErrorMessage = false;
  @Output() errorMessages: string[] = [];
  @Output() confirmedPasswordResult: boolean = false;

  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

  constructor(private registrationService: RegistrationService, private router: Router,
    private formBuilder: FormBuilder)
  { 
    this.registrationForm = this.formBuilder.group({
      login: [this.model.login, Validators.required],
      password: [this.model.password, [Validators.required, Validators.minLength(6),
        Validators.maxLength(100), Validators.pattern(this.passwordRegex)]],
      email: [this.model.email, [Validators.required, Validators.pattern(this.emailPattern)]],
    });
  }

  registration() {
    if (this.registrationForm.valid) {
      if (this.registrationForm.get('password')?.value == this.confirmedPassword) {
        this.registrationService.registration(this.registrationForm.value).subscribe({
          next: result => {
            this.router.navigate(['/login']);
          },
          error: error => {
            this.getErrorMessage = true;
            this.confirmedPasswordResult = true;
            this.errorMessages = error;
          }
        });
      }
    }
  }

}
