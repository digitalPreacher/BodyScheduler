import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Subject, catchError } from 'rxjs';
import { singleErrorHandler } from '../../../utils/error-handlers';
import { ExperienceData } from './models/experience-data';

@Injectable({
  providedIn: 'root'
})
export class ExperienceBarService {
  userExperienceChangeData$: Subject<boolean> = new Subject<boolean>();
  constructor(private httpClient: HttpClient) { }

  incrementUserExperience(userId: string) {
    return this.httpClient.get(environment.apiUrl + `/UserExperience/CalculateUserExperience/userId=${userId}`)
      .pipe(result => {
        return result;
      },
        catchError(error => {
          return singleErrorHandler(error);
        }))
  }

  //get user experience
  getUserExperience(userId: string) {
    return this.httpClient.get<ExperienceData>(environment.apiUrl + `/UserExperience/GetUserExperience/userId=${userId}`)
      .pipe(result => {
        return result;
      },
        catchError(error => {
          return singleErrorHandler(error);
        }))
  }

}
