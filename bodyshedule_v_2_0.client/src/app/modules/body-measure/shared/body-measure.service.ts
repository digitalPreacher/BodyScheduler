import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { AuthorizationService } from '../../authorization/shared/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class BodyMeasureService {

  baseUrl = 'https://localhost:7191';

  userId = '';
  userDataSubscribtion: any;
  changeData$: Subject<boolean> = new Subject<boolean>();

  constructor(private httpClient: HttpClient, private authService: AuthorizationService) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    })
  }

  //adding new entry of body measure
  addBodyMeasure(model: any) {
    return this.httpClient.post<any>(this.baseUrl + '/BodyMeasure/AddBodyMeasure', model)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message)
        })
      );
  }


  //getting last added entry with unique muscleName
  getUniqueBodyMeasure() {
    return this.httpClient.get<any[]>(this.baseUrl + `/BodyMeasure/GetUniqueBodyMeasure/${this.userId}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message)
        })
      );
  }
}
