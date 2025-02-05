import { Injectable } from "@angular/core";
import { EventService } from "../../events/shared/event.service";
import { ExerciseTitleDataProvider } from "../interfaces/exercise-title-data-provider.interface";

@Injectable({
  providedIn: 'root'
})

export abstract class LoadExerciseTitleData {
  exerciseTitleDataSubscribe: any;
  listValue: string[] = [];

  constructor(protected exerciseTitleDataProvider: ExerciseTitleDataProvider) { }

  ngOnInit() {
    //load exercise titles
    this.exerciseTitleDataSubscribe = this.exerciseTitleDataProvider.getExerciseTitles().subscribe(data => {
      this.listValue = data;
    });
  }

}
