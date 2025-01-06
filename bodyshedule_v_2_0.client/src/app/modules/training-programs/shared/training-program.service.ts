import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { AuthorizationService } from '../../authorization/shared/authorization.service';
import { TrainingProgram } from './interfaces/training-program.interface';
import { TrainingProgramList } from './interfaces/training-program-list.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingProgramService {
  userDataSubscribtion: any;
  programChangeData$: Subject<boolean> = new Subject<boolean>();
  userId = '';
  occurredErrorMessage = 'Произошла неизвестная ошибка, повторите попытку чуть позже или сообщите в техподдержку';

  constructor(private httpClient: HttpClient, private authService: AuthorizationService) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    })
}

  //adding new training program
  addTrainingProgram(programData: TrainingProgram) {
    return this.httpClient.post(environment.apiUrl + "/TrainingProgram/AddTrainingProgram", programData)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }

  //getting all training programs by user id 
  getTrainingPrograms(): Observable<TrainingProgramList[]> {
    return this.httpClient.get<TrainingProgramList[]>(environment.apiUrl + `/TrainingProgram/GetTrainingPrograms/${this.userId}`)
      .pipe(
        result => {
          return result; 
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }

  //get data of training program by id 
  getTrainingProgram(programId: number): Observable<TrainingProgram[]> {
    return this.httpClient.get<TrainingProgram[]>(environment.apiUrl + `/TrainingProgram/GetTrainingProgram/${programId}`).pipe(
      result => {
        return result;
      },
      catchError(error => {
        return throwError(error.error.message || this.occurredErrorMessage);
      })
    );
  }

  //delete training program
  deleteTrainingProgram(programId: number): Observable<any> {
    return this.httpClient.delete(environment.apiUrl + `/TrainingProgram/DeleteTrainingProgram/${programId}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message || this.occurredErrorMessage);
        })
      );
  }

  //edit training program
  editTrainingProgram(trainingProgram: any) {
    return this.httpClient.put(environment.apiUrl + `/TrainingProgram/EditTrainingProgram`, trainingProgram)
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
