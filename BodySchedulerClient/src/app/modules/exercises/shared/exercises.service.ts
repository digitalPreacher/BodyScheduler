import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, Subject, catchError } from 'rxjs';
import { singleErrorHandler } from '../../../utils/error-handlers';
import { GetExerciseData } from './models/get-exercise-data.model';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {
  changeExercisesData$: Subject<boolean> = new Subject<boolean>();

  constructor(private httpClient: HttpClient){ }

  addExercises(exerciseFormData: FormData) {
    return this.httpClient.post(environment.apiUrl + '/CustomExercises/AddCustomExercises', exerciseFormData)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return singleErrorHandler(error);
        })
      )
  }

  getCustomExercises(userId: string) {
    return this.httpClient.get<any>(environment.apiUrl + `/CustomExercises/GetExercises/${userId}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return singleErrorHandler(error);
        })
      )
  }

}
