import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, catchError, throwError } from 'rxjs';
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

  addTrainingProgram(programData: any) {
    return this.httpClient.post<any>(this.baseUrl + "/Event/AddTrainingProgram", programData)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return throwError(error.error.message)
        })
      );
  }

}
