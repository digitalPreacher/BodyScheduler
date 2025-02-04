import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, catchError, map, pipe, throwError } from 'rxjs';

import { RegistrationData } from '../shared/registration-data.model'
import { environment } from '../../../../environments/environment';
import { multipleErrorHandler } from '../../../utils/error-handlers'

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private httpClient: HttpClient) { }

  registration(model: RegistrationData) {
    return this.httpClient.post<RegistrationData>(environment.apiUrl + "/Account/UserSignUp", model)
      .pipe(map(result => { return result }),
        catchError(error => {
          const errorResult = multipleErrorHandler(error);
          return errorResult;
        }));
  }
}
