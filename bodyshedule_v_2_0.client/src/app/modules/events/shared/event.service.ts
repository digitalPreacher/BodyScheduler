import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, throwError } from 'rxjs';

import { AuthorizationService } from '../../authorization/shared/authorization.service';
import { options } from '@fullcalendar/core/preact';
import { ChangeEventStatus } from './change-event-status.model';

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

  //get all user events by id
  getEvents(status: string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl + `/Event/GetEvents/${this.userId}/${status}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message)
        })
      );
  }

  //getting event by id
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

  //editing data of event
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

  //adding new event
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

  //delete event by id
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

  //get titles of exercise
  getExerciseTitles() {
    return this.httpClient.get<any[]>(this.baseUrl + `/ExerciseTitles/GetExerciseTitles`)
    .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message)
        })
      );
  }

  changeEventStatus(model: ChangeEventStatus) {
    return this.httpClient.put<ChangeEventStatus>(this.baseUrl + `/Event/ChangeEventStatus`, model)
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
