import { Component, Output, inject, TemplateRef, OnInit } from '@angular/core';
import { Event } from '../../shared/event.model';
import { EventService } from '../../shared/event.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from "@angular/common";

import { AuthorizationService } from '../../../authorization/shared/authorization.service';

import moment, { utc } from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styles: '',
  providers: [DatePipe]
})
export class CreateComponent implements OnInit {
  userDataSubscribtion: any;
  createForm: FormGroup;
  modalService = inject(NgbModal);
  userId: string = '';
  

  @Output() submittedClick = false;

  constructor(private eventService: EventService, private formBuilder: FormBuilder,
    private authService: AuthorizationService, private datePipe: DatePipe) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    });
    this.createForm = this.formBuilder.group({
      userId: [this.userId, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.eventService.eventChangeData$.subscribe(data => {
      if (data) {
        this.createForm = this.formBuilder.group({
          userId: [this.userId, Validators.required],
          title: ['', Validators.required],
          description: ['', Validators.required],
          startTime: ['', Validators.required],
          endTime: ['', Validators.required]
        });
      }
    })
  }

  create() {
    if (this.createForm.valid) {
      const currStartTime = this.datePipe.transform(this.createForm.get('startTime')?.value, 'yyyy-MM-ddTHH:mm:ss.ssS', 'UTC') + 'Z';
      const currEndTime = this.datePipe.transform(this.createForm.get('endTime')?.value, 'yyyy-MM-ddTHH:mm:ss.ssS', 'UTC') + 'Z';
      this.createForm.patchValue({
        startTime: currStartTime,
        endTime: currEndTime
      });
      this.eventService.addEvent(this.createForm.value).subscribe({
        next: result => {
          this.submittedClick = false;
          this.createForm.reset();
          this.modalService.dismissAll();
          this.eventService.eventChangeData$.next(true);
        },
        error: err => {
          console.log(err)
        }
      });
    }
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}
