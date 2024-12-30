import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import { BehaviorSubject, catchError, map, Subject, throwError } from 'rxjs';
import { UserData } from './user-data.model';
import { Router } from '@angular/router';
import { ChangeUserPasswordData } from '../shared/change-user-password-data.model';
import { UserSignInData } from './interfaces/user-sign-in-data.interface';
import { ResetPasswordData } from './reset-password-data.model';


@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  decodeUserDetails: any;
  baseUrl = 'https://localhost:7191';
  userData$ = new BehaviorSubject<UserData>(new UserData());
  constructor(private http: HttpClient, private router: Router) { }

  login(userDetails: User) {
    return this.http.post<UserSignInData>(this.baseUrl + "/Account/UserSignIn", userDetails)
      .pipe(
        map(response => {
          localStorage.setItem('authToken', response.token);
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

  setUserDetails() {
    if (localStorage.getItem('authToken')) {
      const userDetails = new UserData();

      var localStorageValue = localStorage.getItem('authToken');

      if (localStorageValue) {
        this.decodeUserDetails = JSON.parse(window.atob(localStorageValue.split(".")[1]));
      }

      userDetails.login = this.decodeUserDetails.sub;
      userDetails.role = this.decodeUserDetails.role;
      userDetails.userId = this.decodeUserDetails.userId;
      userDetails.isLoggedIn = true;

      console.log(userDetails.userId);

      this.userData$.next(userDetails);
    }
  }

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

  logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    this.userData$.next(new UserData());
  }
}
