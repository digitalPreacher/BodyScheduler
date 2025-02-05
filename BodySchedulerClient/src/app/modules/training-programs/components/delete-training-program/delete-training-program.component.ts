import { Component, Input, Output, TemplateRef, ViewChild, inject, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrainingProgramService } from '../../shared/training-program.service'
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service';

@Component({
  selector: 'app-delete-training-program',
  templateUrl: './delete-training-program.component.html',
  styles: ``
})
export class DeleteTrainingProgramComponent implements OnDestroy {

  modalService = inject(NgbModal);
  isLoadingDataSubscribtion: any;
  isLoading!: boolean;

  @Input() programId!: number;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private trainingProgramService: TrainingProgramService, private loadingService: LoadingService) {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);
  }

  deleteTrainingProgram() {
    this.loadingService.show();
    this.trainingProgramService.deleteTrainingProgram(this.programId).subscribe({
      next: result => {
        this.loadingService.hide();
        this.trainingProgramService.programChangeData$.next(true);
        this.modalService.dismissAll();
      },
      error: err => {
        this.loadingService.hide();
        this.errorModal.openModal(err);
      }
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  ngOnDestroy() {
    this.isLoadingDataSubscribtion.unsubscribe();
  }

}
