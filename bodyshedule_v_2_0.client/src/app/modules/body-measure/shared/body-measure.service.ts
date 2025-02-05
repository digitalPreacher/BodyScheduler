import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { AuthorizationService } from '../../authorization/shared/authorization.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BodyMeasureService {

  userId = '';
  userDataSubscribtion: any;
  changeData$: Subject<boolean> = new Subject<boolean>();
  occurredErrorMessage = 'Произошла неизвестная ошибка, повторите попытку чуть позже или сообщите в техподдержку';

  constructor(private httpClient: HttpClient, private authService: AuthorizationService) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    })
  }

  //adding new entry of body measure
  addBodyMeasure(model: any) {
    return this.httpClient.post<any>(environment.apiUrl + '/BodyMeasure/AddBodyMeasure', model)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }


  //getting last added entry with unique muscleName
  getUniqueBodyMeasure() {
    return this.httpClient.get<any[]>(environment.apiUrl + `/BodyMeasure/GetUniqueBodyMeasure/${this.userId}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }

  getBodyMeasuresDataToLineChart() {
    return this.httpClient.get<any[]>(environment.apiUrl + `/BodyMeasure/GetBodyMeasuresToLineChart/${this.userId}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }
}
