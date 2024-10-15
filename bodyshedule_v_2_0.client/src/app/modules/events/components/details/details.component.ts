import { Component, Input, TemplateRef, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventService } from '../../shared/event.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  providers: [DatePipe]
})
export class DetailsComponent {
  modalService = inject(NgbModal);
  detailsForm: FormGroup;

  @Input() eventId!: number;

  constructor(private eventService: EventService, private formBuilder: FormBuilder, private datePipe: DatePipe) {
    this.detailsForm = this.formBuilder.group({
      id: [''],
      title: [''],
      description: [''],
      startTime: [''],
      endTime: ['']
    });
  }

  getEvent() {
    this.eventService.getEvent(this.eventId).subscribe({
      next: async result => {
        this.eventService.getEvent(this.eventId).subscribe(result => {
          const currStartTime = this.datePipe.transform(result[0].startTime, 'yyyy-MM-ddTHH:mm');
          const currEndTime = this.datePipe.transform(result[0].endTime, 'yyyy-MM-ddTHH:mm');
          this.detailsForm.patchValue({
            id: result[0].id,
            title: result[0].title,
            description: result[0].description,
            startTime: currStartTime,
            endTime: currEndTime
          })
        });
        console.log(this.detailsForm.value);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  open(content: TemplateRef<any>) {
    this.getEvent();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

}
