import { Component, Output } from '@angular/core';
import { User } from '../../shared/user.model';
import { AuthorizationService } from '../../shared/authorization.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent{
  model: User = new User();
  @Output() submitted = false;

  constructor(private authService: AuthorizationService, private router: Router) { }

  login() {
    this.authService.login(this.model).subscribe(result => {
      this.submitted = true;
      this.router.navigate([""]);
    })
  }
}
