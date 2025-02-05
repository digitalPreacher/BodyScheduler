import { Component, OnInit, OnDestroy, inject, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styles: ``
})
export class ErrorModalComponent{

  errorMessage!: string | null;
  modalService = inject(NgbModal);
  currentTemplate: any;
  @ViewChild('errorContent') public template!: TemplateRef<any>;

  constructor() {}

  openModal(errorMessage: string | null) {
    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };
    this.errorMessage = errorMessage;
    this.modalService.open(this.template, options);
  }


}
