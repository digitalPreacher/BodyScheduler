import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { catchError, map, pipe, throwError } from 'rxjs';

import { RegistrationData } from '../shared/registration-data.model'

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  baseUrl = 'https://localhost:7191';

  constructor(private httpClient: HttpClient) { }

  registration(model: RegistrationData) {
    return this.httpClient.post<RegistrationData>(this.baseUrl + "/Event/GetEvents", model)
      .pipe(map(result => { return result }),
        catchError(error => {
          return throwError(error.error.message || ["Произошла неизвестная ошибка"]);
        }));
  }
}
