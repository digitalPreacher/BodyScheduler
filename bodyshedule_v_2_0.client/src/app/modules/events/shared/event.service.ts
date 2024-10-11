import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event} from './event.model';
import { Observable, Subject, catchError, throwError } from 'rxjs';

import { AuthorizationService } from '../../authorization/shared/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  userDataSubscribtion: any;
  eventAdded$: Subject<boolean> = new Subject<boolean>();
  subscribed: any;
  userLogin = '';

  baseUrl = 'https://localhost:7191';

  constructor(private httpClient: HttpClient, private authService: AuthorizationService)
  {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userLogin = data.login;
    })
  }

  getEvents(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl + `/Event/GetEvents/${this.userLogin}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message)
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

}
