import { Component, Input, OnInit, OnDestroy, TemplateRef, ViewChild, inject } from '@angular/core';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { LoadingService } from '../../../shared/service/loading.service';
import { ExercisesService } from '../../shared/exercises.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-exercise',
  templateUrl: './delete-exercise.component.html',
  styleUrl: './delete-exercise.component.css'
})
export class DeleteExerciseComponent implements OnInit, OnDestroy {
  userDataSubscribtion: any;
  userId: string = '';
  isLoadingDataSubscribtion: any;
  isLoading: boolean = false;
  modalService = inject(NgbModal);
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;
  @ViewChild('deleteCustomExerciseContent') template!: TemplateRef<any>;
  @Input() exerciseId!: number;

  constructor(private exercisesService: ExercisesService, private authService: AuthorizationService, private loadingService: LoadingService) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    })
  }

  ngOnInit() {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);
  }

  //delete custom exercise
  deleteExercise() {
    this.loadingService.show();
    this.exercisesService.deleteCustomExercise(this.userId, this.exerciseId).subscribe({
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

  //open modal form
  open(content: TemplateRef<any>) {
    const options: NgbModalOptions = {
      size: 'md',
      ariaLabelledBy: 'modal-basic-title'
    };
    this.modalService.open(content, options);
  }

  ngOnDestroy() {
    this.userDataSubscribtion.unsubscribe();
    this.isLoadingDataSubscribtion.unsubscribe();
  }
}
