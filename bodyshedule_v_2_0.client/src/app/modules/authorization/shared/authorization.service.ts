import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import { BehaviorSubject, catchError, map, Subject, throwError } from 'rxjs';
import { UserData } from './user-data.model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  decodeUserDetails: any;
  baseUrl = 'https://localhost:7191';
  userData$ = new BehaviorSubject<UserData>(new UserData());
  constructor(private http: HttpClient, private router: Router) { }

  login(userDetails: User) {
    return this.http.post<any>(this.baseUrl + "/Account/UserSignIn", userDetails)
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

      console.log(userDetails.userId);

      this.userData$.next(userDetails);
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    this.userData$.next(new UserData());
  }
}
