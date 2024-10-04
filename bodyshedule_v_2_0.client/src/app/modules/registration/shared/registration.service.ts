import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { RegistrationData } from '../shared/registration-data.model'
import { map, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  baseUrl = 'https://localhost:7191';

  constructor(private httpClient: HttpClient) { }

  registration(model: RegistrationData) {
    return this.httpClient.post<RegistrationData>(this.baseUrl + "/Account/UserSignUp", model)
      .pipe(result => { return result });
  }

}
