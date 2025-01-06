import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { User } from './user.model';
import { BehaviorSubject, catchError, map, Subject, throwError } from 'rxjs';
import { UserData } from './user-data.model';
import { Router } from '@angular/router';
import { ChangeUserPasswordData } from '../shared/change-user-password-data.model';
import { UserSignInData } from './interfaces/user-sign-in-data.interface';
import { ResetPasswordData } from './reset-password-data.model';
import { CookieService } from '../../shared/service/cookie.service';
import { __values } from 'tslib';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  decodeUserDetails: any;
  baseUrl = environment.apiUrl;
  userData$ = new BehaviorSubject<UserData>(new UserData());
  token: string;
  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {
    this.token = this.cookieService.getCookie('token');
    if (this.token) {
      this.setUserDetails();
    }
  }

  //log in to app
  login(userDetails: User) {
    return this.http.post<UserSignInData>(this.baseUrl + "/Account/UserSignIn", userDetails)
      .pipe(
        map(response => {
          this.cookieService.setCookie({ name: 'token', value: response.token });
          this.setUserDetails();

          return response;
        }),
        catchError(error => {
          if (error.status === 401) {
            return throwError('Некорретный логин/пароль')
          }
          return throwError('Произошла неизвестная ошибка');
        })
      );
  }

  //set user data from token
  setUserDetails() {
    const userDetails = new UserData();

    this.token = this.cookieService.getCookie('token');

    if (this.token) {
        this.decodeUserDetails = JSON.parse(window.atob(this.token.split(".")[1]));
    }

    userDetails.login = this.decodeUserDetails.sub;
    userDetails.role = this.decodeUserDetails.role;
    userDetails.userId = this.decodeUserDetails.userId;
    userDetails.isLoggedIn = true;

    this.userData$.next(userDetails);
  }

  //change curren user password
  changeUserPassword(changeUserPasswordData: ChangeUserPasswordData) {
    return this.http.post(this.baseUrl + "/Account/ChangePassword", changeUserPasswordData)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || [error.error] || ["Произошла неизвестная ошибка"])
        })
      );
  }


  //forgot user password
  forgotUserPassword(email: string) {
    return this.http.post<any>(this.baseUrl + "/Account/ForgotPassword", email)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
         
          return throwError(error.error.message || [error.error] ||  ["Произошла неизвестная ошибка"]);
        })
      );
  }

  //reset forgot user password
  resetUserPassword(resetPasswordData: ResetPasswordData) {
    return this.http.post<any>(this.baseUrl + "/Account/ResetPassword", resetPasswordData)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || [error.error] || ["Произошла неизвестная ошибка"])
        })
      );
  }

  //logout from app
  logout() {
    this.cookieService.deleteCookie('token');
    window.location.href = '/login';
    this.userData$.next(new UserData());
  }
}
