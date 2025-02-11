import { Injectable, OnDestroy } from "@angular/core";
import { EventService } from "../../events/shared/event.service";
import { ExerciseTitleDataProvider } from "../interfaces/exercise-title-data-provider.interface";
import { CustomExerciseTitleData } from "../models/custom-exercise-title-data.model";

@Injectable({
  providedIn: 'root'
})

export abstract class LoadExerciseTitleData {
  exerciseTitleDataSubscribe: any;
  listValue!: any[];

  constructor(protected exerciseTitleDataProvider: ExerciseTitleDataProvider) { }

  ngOnInit() {
    //load exercise titles
    this.exerciseTitleDataSubscribe = this.exerciseTitleDataProvider.getExerciseTitles().subscribe(data => {
      this.listValue = data;
    });
  }

}
