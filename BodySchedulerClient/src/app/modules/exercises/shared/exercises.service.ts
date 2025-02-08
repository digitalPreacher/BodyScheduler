import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs';
import { singleErrorHandler } from '../../../utils/error-handlers';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {

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
}
