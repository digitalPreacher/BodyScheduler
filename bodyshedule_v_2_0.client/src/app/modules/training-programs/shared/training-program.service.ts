import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { AuthorizationService } from '../../authorization/shared/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingProgramService {
  userDataSubscribtion: any;
  programChangeData$: Subject<boolean> = new Subject<boolean>();
  baseUrl = 'https://localhost:7191';
  userId = '';

  constructor(private httpClient: HttpClient, private authService: AuthorizationService) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    })
}

  //adding new training program
  addTrainingProgram(programData: any) {
    return this.httpClient.post<any>(this.baseUrl + "/TrainingProgram/AddTrainingProgram", programData)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message);
        })
      );
  }

  //getting all training programs by user id 
  getTrainingPrograms(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl + `/TrainingProgram/GetTrainingPrograms/${this.userId}`)
      .pipe(
        result => {
          return result; 
        },
        catchError(error => {
          return throwError(error.error.message);
        })
      );
  }

  //get data of training program by id 
  getTrainingProgram(programId: number): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + `/TrainingProgram/GetTrainingProgram/${programId}`).pipe(
      result => {
        return result;
      },
      catchError(error => {
        return throwError(error.error.message);
      })
    );
  }

  //delete training program
  deleteTrainingProgram(programId: number): Observable<any> {
    return this.httpClient.delete(this.baseUrl + `/TrainingProgram/DeleteTrainingProgram/${programId}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message);
        })
      );
  }

  //edit training program
  editTrainingProgram(trainingProgram: any) {
    return this.httpClient.put(this.baseUrl + `/TrainingProgram/EditTrainingProgram`, trainingProgram)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message);
        })
      );
  }
}
