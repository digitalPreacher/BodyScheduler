import { Component, Input, Output, TemplateRef, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrainingProgramService } from '../../shared/training-program.service'

@Component({
  selector: 'app-delete-training-program',
  templateUrl: './delete-training-program.component.html',
  styles: ``
})
export class DeleteTrainingProgramComponent {

  modalService = inject(NgbModal);

  @Input() programId!: number;
  constructor(private trainingProgramService: TrainingProgramService) { }

  deleteTrainingProgram() {
    this.trainingProgramService.deleteTrainingProgram(this.programId).subscribe({
      next: result => {
        this.trainingProgramService.programChangeData$.next(true);
        this.modalService.dismissAll();
      },
       error: err => {
        console.log(err);
      }
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

}
