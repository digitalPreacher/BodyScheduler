import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { UserAdministrationData } from '../interfaces/user-administration-data.interface';
import { UserAdministrationEditData } from '../interfaces/user-administration-edit-data.interface';


@Injectable({
  providedIn: 'root'
})
export class UserAdministrationService {
  userChangeData$: Subject<boolean> = new Subject<boolean>();

  occurredErrorMessage = 'Произошла неизвестная ошибка, повторите попытку чуть позже или сообщите в техподдержку';

  constructor(private httpClient: HttpClient) { }

  //get list of users for administration
  getUsers(): Observable<UserAdministrationData[]> {
    return this.httpClient.get<UserAdministrationData[]>(environment.apiUrl + '/AdminUser/GetApplicationUsers')
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.message || error.error.message || this.occurredErrorMessage);
        })
      );
  }

  //get user data by user id
  getUser(id: number): Observable<UserAdministrationData> {
    return this.httpClient.get<UserAdministrationData>(environment.apiUrl + `/AdminUser/GetApplicationUser/${id}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.message || error.error.message || this.occurredErrorMessage);
        })
      );
  }

  //edit user data
  editUserData(userData: UserAdministrationEditData) {
    return this.httpClient.put(environment.apiUrl + '/AdminUser/UpdateUserData', userData)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
           return throwError(error.message || error.error.message || this.occurredErrorMessage);
         })
      )
  }
}
