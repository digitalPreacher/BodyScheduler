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
  model: any[] = [{"test": "test"}];
  title: string = '';
  createForm: FormGroup;
  eventModel: Event[] = [];

  testEvent: any;

  @Output() submittedClick = false;
  

  constructor(private eventService: EventService, private formBuilder: FormBuilder,
    private authService: AuthorizationService, private datePipe: DatePipe) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    });
    this.createForm = this.formBuilder.group({
/*      id: [''],*/
      title: [''],
      description: [''],
      //start: [''],
      //end: ['']
    });
  }

  @Input() eventId!: number;



  getEvent() {
    this.eventService.getEvent(this.eventId).subscribe({
      next: async result => {
        

        console.log(this.createForm.value);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  open(content: TemplateRef<any>) {
    this.eventService.getEvent(this.eventId).subscribe(async result =>
    {
      this.model = result;
      this.testEvent = JSON.parse(this.model.toString())

      this.createForm.patchValue(this.model);
      console.log(this.model);
    });
    
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

}
