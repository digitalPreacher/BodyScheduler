import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UpdateAchievementData } from '../models/update-achievement-data.model';
import { catchError } from 'rxjs';
import { singleErrorHandler } from '../../../utils/error-handlers';
import { options } from '@fullcalendar/core/preact';

@Injectable({
  providedIn: 'root'
})
export class UpdateAchievementService {

  constructor(private httpClient: HttpClient) { }

  //update user achievement
  updateAchievement(userId: string, achievementName: string[]) {
    const updateAchievementData = new UpdateAchievementData();
    updateAchievementData.userId = userId;
    updateAchievementData.achievemetNames = achievementName;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    let jsonData = JSON.stringify(updateAchievementData);

    return this.httpClient.put(environment.apiUrl + "/Achievements/UpdateAchievements", jsonData, { headers: headers } )
      .pipe(
        result => {
          return result;
        },
        catchError(error => {
          return singleErrorHandler(error);
        }));
  }
}
