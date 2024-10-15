import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, throwError } from 'rxjs';

import { AuthorizationService } from '../../authorization/shared/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  userDataSubscribtion: any;
  eventChangeData$: Subject<boolean> = new Subject<boolean>();
  subscribed: any;
  userId = '';

  baseUrl = 'https://localhost:7191';

  constructor(private httpClient: HttpClient, private authService: AuthorizationService)
  {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    })
  }

  getEvents(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl + `/Event/GetEvents/${this.userId}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message)
        })
      );
  }

  getEvent(id: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `/Event/GetEvent/${id}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message)
        })
      );
  }

  editEvent(model: any) {
    return this.httpClient.put<any>(this.baseUrl + "/Event/EditEvent", model).
      pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message);
        })
      );
  }

  addEvent(model: any) {
    return this.httpClient.post<any>(this.baseUrl + "/Event/AddEvent", model)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message)
        })
      );
  }

  deleteEvent(id: number) {
    return this.httpClient.delete(this.baseUrl + `/Event/DeleteEvent/${id}`)
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
