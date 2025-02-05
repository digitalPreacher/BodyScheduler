import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { UserReportData } from '../interfaces/user-report-data.interface';
import { environment } from '../../../../environments/environment';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserErrorReportService {

  occurredErrorMessage = 'Произошла неизвестная ошибка, повторите попытку чуть позже или сообщите в техподдержку';

  constructor(private httpClient: HttpClient) { }

  sendUserReport(reportInfo: UserReportData) {
    return this.httpClient.post(environment.apiUrl + '/UserErrorReport/UserErrorReport', reportInfo)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || [error.error] ||  this.occurredErrorMessage);
        })
      );
  }

}
