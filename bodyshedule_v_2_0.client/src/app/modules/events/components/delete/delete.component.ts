import { Component, Input, Output, TemplateRef, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EventService } from '../../shared/event.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
})
export class DeleteComponent {
  modalService = inject(NgbModal);

  constructor(private eventService: EventService) { }

  @Input() eventId!: number;

  deleteEvent() {
    this.eventService.deleteEvent(this.eventId).subscribe({
      next: result => {
        this.eventService.eventChangeData$.next(true);
        this.modalService.dismissAll();
      },
      error: err => {
        console.log(err);
      }
    });
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

}
