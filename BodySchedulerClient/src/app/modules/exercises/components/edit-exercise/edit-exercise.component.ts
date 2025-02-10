import { Component, Input, TemplateRef, ViewChild, inject } from '@angular/core';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { LoadingService } from '../../../shared/service/loading.service';
import { ExercisesService } from '../../shared/exercises.service';
import { ExerciseData } from '../../shared/models/exercise-data.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-exercise',
  templateUrl: './edit-exercise.component.html',
  styleUrl: './edit-exercise.component.css'
})
export class EditExerciseComponent {
  userDataSubscribtion: any;
  isLoadingDataSubscribtion: any;
  isLoading: boolean = false;
  modalService = inject(NgbModal);
  exerciseData: ExerciseData = new ExerciseData();
  submitButtonClick: boolean = false;
  previewImage: string = '';
  exerciseImageData: string = '';
  isGetImage: boolean = false;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;
  @Input() exerciseId!: number;

  constructor(private exercisesService: ExercisesService, private authService: AuthorizationService, private loadingService: LoadingService) {
  }

  ngOnInit() {}

  //select file from directory os
  onChange(event: any) {
    if (event && event.target.files && event.target.files[0] && !this.isGetImage) {
      this.exerciseData.image = event.target.files[0];
      this.previewImage = URL.createObjectURL(event.target.files[0]).toString();
      this.isGetImage = true;
    }
  }

  //get custom exercise by exerciseId
  getCustomExercise() {
    this.exercisesService.getCustomExercise(this.exerciseId).subscribe({
      next: data => {
        this.exerciseData = data;
        if (this.exerciseData.image) {
          this.isGetImage = true;
          this.previewImage = 'data:image/jpg;base64,' + this.exerciseData?.image;
        }
        else {
          this.isGetImage = false;
          this.previewImage = 'data:image/jpg;base64,' + this.exerciseData?.image;
        }
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    })
  }

  //send edit data to api
  saveData() {
    this.submitButtonClick = true;
    if (this.exerciseData.exerciseTitle !== undefined && this.exerciseData.exerciseTitle !== '') {
      this.loadingService.show();

      this.authService.userData$.pipe(
        filter(data => !!data.userId),
        switchMap(x => {
          let formData = new FormData();
          formData.append('userId', x.userId || '');
          formData.append('exerciseId', this.exerciseId.toString());
          formData.append('exerciseTitle', this.exerciseData.exerciseTitle);
          formData.append('exerciseDescription', this.exerciseData.exerciseDescription || '');

          if (typeof this.exerciseData?.image === "string") {
            let file = this.base64ToFile(this.exerciseData?.image, this.exerciseData?.fileName, 'image/jpg')
            formData.append('image', file || '');
          }
          else{
            formData.append('image', this.exerciseData?.image || '');
          }

          return this.exercisesService.editCustomExercises(formData);
        })
      )
      .subscribe({
        next: result => {
          this.loadingService.hide();
          this.modalService.dismissAll();
          this.exercisesService.changeExercisesData$.next(true);
        },
        error: err => {
          this.loadingService.hide();
          this.errorModal.openModal(err);
        }
      })
    }
  }

  //remove image to from
  removeImage() {
    this.isGetImage = false;
    this.exerciseData.image = undefined;
    this.previewImage = '';
  }

  //open modal form
  open(content: TemplateRef<any>) {
    this.getCustomExercise()
    this.submitButtonClick = false;

    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };
    this.modalService.open(content, options);
  }

  //convert base64 byte image string to File
  private base64ToFile(base64String: string, fileName: string, contentType: string): File {
    const byteString = atob(base64String);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: contentType });
    return new File([blob], fileName, { type: contentType });
  }

}
