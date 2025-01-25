import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserData } from '../shared/user-data.model'
import { AuthorizationService } from '../shared/authorization.service'
import { Observable } from 'rxjs/internal/Observable';
import { CookieService } from '../../shared/service/cookie.service';

@Injectable({
  providedIn: 'root'
})

export class AuthorizationAdminGuard implements CanActivate {
  userDataSubscribtion: any;
  userData = new UserData();

  constructor(private router: Router, private authService: AuthorizationService, private cookieService: CookieService) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userData = data;
    });
  }

  //implementation CanActivate iterface to be a guard deciding if a route can be activated
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userData.isLoggedIn && this.userData.role === 'Admin') {
      return true;
    }
    this.router.navigate([''], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
