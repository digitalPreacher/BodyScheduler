import { Component, Input, Output, TemplateRef, inject, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EventService } from '../../shared/event.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
})
export class DeleteComponent implements OnDestroy {

  modalService = inject(NgbModal);

  isLoadingDataSubscribtion: any;
  isLoading: any;

  constructor(private eventService: EventService, private loadingService: LoadingService) {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);
  }

  @Input() eventId!: number;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  deleteEvent() {
    this.eventService.deleteEvent(this.eventId).subscribe({
      next: result => {
        this.eventService.eventChangeData$.next(true);
        this.modalService.dismissAll();
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    });
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  ngOnDestroy() {
    this.isLoadingDataSubscribtion.unsubscribe();
  }

}
