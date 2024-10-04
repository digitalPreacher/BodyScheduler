import { Component } from '@angular/core';
import { RegistrationService } from '../../shared/registration.service';
import { RegistrationData } from '../../shared/registration-data.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: ``
})
export class RegistrationComponent {
  model: RegistrationData = new RegistrationData();

  constructor(private registrationService: RegistrationService, private router: Router) { }

  registration() {
    this.registrationService.registration(this.model).subscribe(result => {
      this.router.navigate(['/login'])
    })
  }

}
