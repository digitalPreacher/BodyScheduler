import { Component, Input, Output, TemplateRef, inject } from '@angular/core';
import { EventService } from '../../shared/event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Event } from '../../shared/event.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styles: ``,
  providers: [DatePipe]
})
export class EditComponent {
  userDataSubscribtion: any;
  modalService = inject(NgbModal);
  userId: any;
  title: string = '';
  createForm: FormGroup;
 

  @Output() submittedClick = false;

  @Input() eventId!: number;
  

  constructor(private eventService: EventService, private formBuilder: FormBuilder,
    private authService: AuthorizationService, private datePipe: DatePipe) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    });
    this.createForm = this.formBuilder.group({
      userId: [this.userId, Validators.required],
      id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  saveEvent() {
    if (this.createForm.valid) {
      const currStartTime = this.datePipe.transform(this.createForm.get('startTime')?.value, 'yyyy-MM-ddTHH:mm:ss.ssS', 'UTC') + 'Z';
      const currEndTime = this.datePipe.transform(this.createForm.get('endTime')?.value, 'yyyy-MM-ddTHH:mm:ss.ssS', 'UTC') + 'Z';
      this.createForm.patchValue({
        startTime: currStartTime,
        endTime: currEndTime
      });
      this.eventService.editEvent(this.createForm.value).subscribe({
        next: result => {
          this.submittedClick = false;
          this.modalService.dismissAll();
          this.eventService.eventChangeData$.next(true);
        },
        error: err => {
          console.log(err)
        }
      });
    }
  }

  getEvent() {
    this.eventService.getEvent(this.eventId).subscribe({
      next: async result => {
        this.eventService.getEvent(this.eventId).subscribe(result => {
          const currStartTime = this.datePipe.transform(result[0].startTime, 'yyyy-MM-ddTHH:mm');
          const currEndTime = this.datePipe.transform(result[0].endTime, 'yyyy-MM-ddTHH:mm');
          this.createForm.patchValue({
            id: result[0].id,
            title: result[0].title,
            description: result[0].description,
            startTime: currStartTime,
            endTime: currEndTime
          })
        });
        console.log(this.createForm.value);
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
