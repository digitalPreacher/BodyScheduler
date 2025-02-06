import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment';
import { TrainingResult } from './interfaces/training-result.interface';
import { Observable, catchError } from 'rxjs';
import { singleErrorHandler } from '../../../utils/error-handlers';

@Injectable({
  providedIn: 'root'
})
export class TrainingResultService {

  constructor(private httpClient: HttpClient) { }

  //get training results by user id
  getTrainingResults(userId: string) {
    return this.httpClient.get<any>(environment.apiUrl + `/TrainingResult/GetTrainingResults/${userId}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return singleErrorHandler(error);
        }));
  }

}
