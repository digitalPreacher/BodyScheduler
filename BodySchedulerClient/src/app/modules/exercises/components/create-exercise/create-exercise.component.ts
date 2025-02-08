import { Component, TemplateRef, ViewChild, inject, OnInit, OnDestroy } from '@angular/core';
import { ExerciseData } from '../../shared/models/exercise-data.model';
import { ExercisesService } from '../../shared/exercises.service';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service';

@Component({
  selector: 'app-create-exercise',
  templateUrl: './create-exercise.component.html',
  styleUrl: './create-exercise.component.css'
})
export class CreateExerciseComponent implements OnInit, OnDestroy {
  isLoadingDataSubscribtion: any;
  isLoading: boolean = false;
  userDataSubscribtion: any;
  exerciseData: ExerciseData = new ExerciseData();
  modalService = inject(NgbModal);
  userId: string = '';
  submitButtonClick: boolean = false;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private exerciseService: ExercisesService, private authService: AuthorizationService, private loadingService: LoadingService) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    })
  }

  ngOnInit() {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);
  }

  //select file from directory os
  onChange(event: any) {
    this.exerciseData.image = event.target.files[0];
  }

  //send data to api
  saveData() {
    this.submitButtonClick = true;

    if (this.exerciseData.exerciseTitle !== undefined && this.exerciseData.exerciseTitle !== '') {
      this.loadingService.show();

      let formData = new FormData();
      formData.append('userId', this.userId);
      formData.append('image', this.exerciseData.image);
      formData.append('exerciseTitle', this.exerciseData.exerciseTitle);
      formData.append('exerciseDescription', this.exerciseData.exerciseDescription || '');

      this.exerciseService.addExercises(formData).subscribe({
        next: result => {
          this.loadingService.hide();
          this.modalService.dismissAll();
          this.exerciseService.changeExercisesData$.next(true);
        },
        error: err => {
          this.loadingService.hide();
          this.errorModal.openModal(err);
        }
      })
    }
  }

  //open modal form
  open(content: TemplateRef<any>) {
    this.exerciseData = new ExerciseData();
    this.submitButtonClick = false;

    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };
    this.modalService.open(content, options);
  }

  ngOnDestroy() {
    this.userDataSubscribtion.unsubscribe();
    this.isLoadingDataSubscribtion.unsubscribe();
  }
}
