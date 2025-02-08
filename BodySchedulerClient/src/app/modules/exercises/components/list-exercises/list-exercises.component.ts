import { Component, ViewChild } from '@angular/core';
import { ExercisesService } from '../../shared/exercises.service';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { LoadingService } from '../../../shared/service/loading.service';
import { GetExerciseData } from '../../shared/models/get-exercise-data.model';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-list-exercises',
  templateUrl: './list-exercises.component.html',
  styleUrl: './list-exercises.component.css'
})
export class ListExercisesComponent {
  isLoadingDataSubscribtion: any;
  isLoading: boolean = false;
  isChangeExercisesDataSubscribtion: any
  userDataSubscribtion: any;
  userId: string = '';
  exercises!: GetExerciseData[];
  exercise!: GetExerciseData | undefined;
  isGetExercise = false;
  imageData: string = '';

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private exercisesService: ExercisesService, private authService: AuthorizationService, private loadingService: LoadingService) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    })
  }

  ngOnInit() {
    this.getExercises();

    this.isChangeExercisesDataSubscribtion = this.exercisesService.changeExercisesData$.asObservable().subscribe(
      data => {
        if (data) {
          this.getExercises();
        }
      }
    )

    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);
  }

  //get exercises list 
  getExercises() {
    this.loadingService.show();
    this.exercisesService.getCustomExercises(this.userId).subscribe({
      next: result => {
        this.loadingService.hide();
        this.exercises = result;
        this.setFirstExercise(result);
      },
      error: err => {
        this.loadingService.hide();
        this.errorModal.openModal(err);
      }
    })
  }

  //set exercise data after first loading page 
  setFirstExercise(exercises: GetExerciseData[]) {
    if (exercises.length != 0) {
      this.exercise = this.exercises[0];
      this.isGetExercise = true;
      this.imageData = 'data:image/jpg;base64,' + this.exercise?.image;
    }
  }

  //get first exercise by id from exercises array
  getExercise(exerciseId: number) {
    this.isGetExercise = true;
    this.exercise = this.exercises.find(x => x.exerciseId == exerciseId);
    this.imageData = 'data:image/jpg;base64,' + this.exercise?.image;
  }

  ngOnDestroy() {
    this.userDataSubscribtion.unsubscribe();
    this.isLoadingDataSubscribtion.unsubscribe();
    this.isChangeExercisesDataSubscribtion.unsubscribe();
  }
}
