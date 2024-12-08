import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import ruLocale from '@fullcalendar/core/locales/ru';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

import { UserInactivityService } from '../../../authorization/shared/user-inactivity.service';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { EventService } from '../../../events/shared/event.service';
import { pipe } from 'rxjs';
import { Event } from '../../../events/shared/event.model';
import { ChangeEventStatus } from '../../../events/shared/change-event-status.model';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [DatePipe]
})
export class HomeComponent implements OnInit {
  modalService = inject(NgbModal);
  events: any;
  eventStatus: string = 'inProgress';
  model: ChangeEventStatus = new ChangeEventStatus();

  detailsForm: FormGroup;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    locale: ruLocale,
    headerToolbar: {
      left: 'prev,next,today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    eventColor: '#6343ac',
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    eventDisplay: 'block'
  };

  constructor(private authService: AuthorizationService, private inactivityService: UserInactivityService,
    private eventService: EventService, private formBuilder: FormBuilder, private datePipe: DatePipe) {
    this.detailsForm = this.formBuilder.group({
      id: [''],
      title: [''],
      description: [''],
      startTime: [''],
      status: [''],
      exercises: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.loadData();
    this.eventService.eventChangeData$.subscribe(data => {
      if (data) {
        this.loadData();
      }
    })
  }

  //receiving data of events and display it in fullcalendar
  loadData() {
    this.eventService.getEvents(this.eventStatus).subscribe({
      next: events => {
        this.events = events;
        this.calendarOptions = {
          events: this.events
        };
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    });
  }

  //getting data of event and pushing it to form
  getEvent(eventId: number) {
    this.eventService.getEvent(eventId).subscribe({
      next: result => {
        const eventData = result[0];
        this.model.id = eventData.id!;
        const currStartTime = this.datePipe.transform(eventData.startTime, 'yyyy-MM-ddTHH:mm');
        this.detailsForm.patchValue({
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          startTime: currStartTime
        });

        const exercises = this.detailsForm.get('exercises') as FormArray;
        exercises.clear();

        //pushing each exercise to form
        eventData.exercises.forEach((exercise: { id: number; title: string; quantityApproaches: number; quantityRepetions: number; weight: number }) => {
          exercises.push(this.formBuilder.group({
            id: [exercise.id],
            title: [exercise.title],
            quantityApproaches: [exercise.quantityApproaches],
            quantityRepetions: [exercise.quantityRepetions],
            weight: [exercise.weight]
          }));
        })

      },
      error: err => {
        this.errorModal.openModal(err);
      }
    });
  }

  //getting FormArray exercises
  get getExercise() {
    return this.detailsForm.get('exercises') as FormArray;
  }

  //open modal of event
  open(content: TemplateRef<any>, eventId: number) {
    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };
    this.getEvent(eventId);
    this.modalService.open(content, options);
  }

  //change status of an event
  changeEventStatus(status: string) {
    this.model.status = status;
    console.log(this.model.status);
    this.eventService.changeEventStatus(this.model).subscribe({
      next: result => {
        this.modalService.dismissAll();
        this.eventService.eventChangeData$.next(true);
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    });
  }

  //logout account
  logout() {
    this.authService.logout();
  }
}
