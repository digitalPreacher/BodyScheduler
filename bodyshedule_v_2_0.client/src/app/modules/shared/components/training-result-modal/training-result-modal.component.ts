import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TrainingResult } from '../../../events/shared/models/training-result.model';

@Component({
  selector: 'app-training-result-modal',
  templateUrl: './training-result-modal.component.html',
  styleUrl: './training-result-modal.component.css'
})
export class TrainingResultModalComponent {
  modalService = inject(NgbModal);
  trainingResult: TrainingResult = new TrainingResult();

  @ViewChild('trainingResultContent') public template!: TemplateRef<any>;

  сconstructor() { }

  openModal(trainingResultData: TrainingResult) {
    this.trainingResult = trainingResultData;

    const options: NgbModalOptions = {
      size: 'sm',
      ariaLabelledBy: 'modal-basic-title'
    };
    this.modalService.open(this.template, options);
  }
}
