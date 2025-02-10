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

  //add custom exercise
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

  //get custom exercise by exerciseId
  getCustomExercise(exerciseId: number) {
    return this.httpClient.get<any>(environment.apiUrl + `/CustomExercises/GetExercise/${exerciseId}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return singleErrorHandler(error);
        })
      )
  }

  //get custom exercise by userId
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

  //delete custom exercise by userId and exerciseId
  deleteCustomExercise(userId: string, exerciseId: number) {
    return this.httpClient.delete(environment.apiUrl + `/CustomExercises/DeleteCustomExercise/${userId}&exerciseId=${exerciseId}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return singleErrorHandler(error);
        })
      )
  }

  //edit custom exercises
  editCustomExercises(exerciseFormData: FormData) {
    return this.httpClient.put(environment.apiUrl + `/CustomExercises/EditCustomExercise`, exerciseFormData)
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
