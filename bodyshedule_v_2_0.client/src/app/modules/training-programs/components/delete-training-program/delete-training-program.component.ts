import { Component, Input, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrainingProgramService } from '../../shared/training-program.service'
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-delete-training-program',
  templateUrl: './delete-training-program.component.html',
  styles: ``
})
export class DeleteTrainingProgramComponent {

  modalService = inject(NgbModal);

  @Input() programId!: number;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private trainingProgramService: TrainingProgramService) { }

  deleteTrainingProgram() {
    this.trainingProgramService.deleteTrainingProgram(this.programId).subscribe({
      next: result => {
        this.trainingProgramService.programChangeData$.next(true);
        this.modalService.dismissAll();
      },
       error: err => {
         this.errorModal.openModal(err);
      }
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

}
