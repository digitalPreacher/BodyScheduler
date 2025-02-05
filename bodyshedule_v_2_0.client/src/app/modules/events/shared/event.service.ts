import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, throwError } from 'rxjs';

import { AuthorizationService } from '../../authorization/shared/authorization.service';
import { options } from '@fullcalendar/core/preact';
import { ChangeEventStatus } from './change-event-status.model';
import { EventList } from './interfaces/event-list.interface';
import { Event } from './interfaces/event.interface';
import { environment } from '../../../../environments/environment';
import { UserData } from '../../authorization/shared/user-data.model';
import { TrainingStateData } from './models/training-state-data.model';
import { TrainingResult } from './models/training-result.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  userDataSubscribtion: any;
  eventChangeData$: Subject<boolean> = new Subject<boolean>();
  subscribed: any;
  userData = new UserData();
  occurredErrorMessage = 'Произошла неизвестная ошибка, повторите попытку чуть позже или сообщите в техподдержку';

  constructor(private httpClient: HttpClient, private authService: AuthorizationService)
  {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userData = data;
    })
  }

  //get all user events by id
  getEvents(status: string): Observable<EventList[]> {
    return this.httpClient.get<EventList[]>(environment.apiUrl + `/Event/GetEvents/${this.userData.userId}/${status}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }

  //getting event by id
  getEvent(id: number): Observable<Event[]> {
    return this.httpClient.get<Event[]>(environment.apiUrl + `/Event/GetEvent/${id}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }

  //getting training state by eventId
  getTrainingState(eventId: number) {
    return this.httpClient.get<string>(environment.apiUrl + `/TrainingState/GetTrainingState/${eventId}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }

  //editing data of event
  editEvent(model: Event) {
    return this.httpClient.put(environment.apiUrl + "/Event/EditEvent", model).
      pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }

  //adding new event
  addEvent(model: Event) {
    return this.httpClient.post(environment.apiUrl + "/Event/AddEvent", model)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }

  //delete event by id
  deleteEvent(id: number) {
    return this.httpClient.delete(environment.apiUrl + `/Event/DeleteEvent/${id}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }

  //get titles of exercise
  getExerciseTitles() {
    return this.httpClient.get<any[]>(environment.apiUrl + `/ExerciseTitles/GetExerciseTitles`)
    .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }

  changeEventStatus(model: ChangeEventStatus) {
    return this.httpClient.put<ChangeEventStatus>(environment.apiUrl + `/Event/ChangeEventStatus`, model)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }

  getTotalSecondsAfterStartTraining(id: number) {
    return this.httpClient.get<number>(environment.apiUrl + `/TrainingState/GetTotalSeconds/${id}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }

  addTrainingResult(trainingResult: TrainingResult) {
    return this.httpClient.post(environment.apiUrl + '/TrainingResult/AddTrainingResult', trainingResult)
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
