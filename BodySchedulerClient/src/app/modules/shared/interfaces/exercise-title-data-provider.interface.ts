import { Observable } from "rxjs";

export interface ExerciseTitleDataProvider {
  getExerciseTitles(): Observable<any[]>;
}
