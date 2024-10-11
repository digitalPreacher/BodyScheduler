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
  userLogin: string = '';

  @Output() submittedClick = false;

  constructor(private eventService: EventService, private formBuilder: FormBuilder,
    private authService: AuthorizationService, private datePipe: DatePipe) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userLogin = data.login;
    });
    this.createForm = this.formBuilder.group({
      userLogin: [this.userLogin, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit() {
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
