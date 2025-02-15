import { Injectable, OnDestroy } from "@angular/core";
import { EventService } from "../../events/shared/event.service";
import { LoadExerciseTitleData } from "./load-exercise-title-data";
import { ExerciseTitleDataProvider } from "../interfaces/exercise-title-data-provider.interface";
import { CustomExerciseTitleData } from "../models/custom-exercise-title-data.model";

@Injectable({
  providedIn: 'root'
})
export abstract class EventBase {
  exerciseTitleDataSubscribe: any;
  listValue!: any[];
  filterListValue: any[] = [];
  isFocusedExerciseFieldList: boolean[] = [];

  constructor(private readonly exerciseTitleDataProvider: ExerciseTitleDataProvider){}

  //Enter value to input field for title of exercise
  enterKeyUp(enterValue: string, index: number) {
    this.filterListValue[index] = this.listValue.filter((value) => {
     return value.title.toLowerCase().includes(enterValue.toLowerCase());
    }).map(item => ({
      title: item.title,
      image: 'data:image/jpg;base64,' + item.image
    }))
  }

  //focused user input field for title of exercise 
  inputFocused(index: number) {
    this.isFocusedExerciseFieldList[index] = true;
  }

  //unfocused user input field for title of exercise and clear filter values
  outFocused(index: number) {
    setTimeout(() => {
      this.isFocusedExerciseFieldList[index] = false;
      this.filterListValue = [];
    }, 100)
  }

  //get exercise title for exercise input field
  getExerciseTitles() {
     this.exerciseTitleDataSubscribe = this.exerciseTitleDataProvider.getExerciseTitles().subscribe(data => {
        this.listValue = data;
     });
  }

  ngOnDestroy() {
    if (this.exerciseTitleDataSubscribe) {
      this.exerciseTitleDataSubscribe.unsubscribe();
    }
  }
}
