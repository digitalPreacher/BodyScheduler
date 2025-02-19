import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment';
import { Achievement } from './models/achievement.model';
import { catchError } from 'rxjs';
import { singleErrorHandler } from '../../../utils/error-handlers';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {

  constructor(private httpClient: HttpClient) { }

  getAchievements(userId: string) {
    return this.httpClient.get<Achievement[]>(environment.apiUrl + `/Achievements/GetAchievements/${userId}`)
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return singleErrorHandler(error);
        }));
  }
}
