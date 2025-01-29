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
import { LoadingService } from '../../../shared/service/loading.service';
import { countupTimer } from '../../../../utils/timer';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [DatePipe]
})
export class HomeComponent implements OnInit, OnDestroy {
  eventChangeDataSubscribtion: any;
  isLoadingDataSubscribtion: any;
  isLoading!: boolean;
  events: any;
  eventStatus: string = 'inProgress';
  model: ChangeEventStatus = new ChangeEventStatus();
  countdownSubscription: any;
  countTimerStartValue: number = 0;
  interval: any;
  timerRunning = false;
  timePaused = false;
  displayTime: any;

  detailsForm: FormGroup;

  modalService = inject(NgbModal);

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
    private eventService: EventService, private formBuilder: FormBuilder, private datePipe: DatePipe,
    private loadingService: LoadingService) {

    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

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
    this.eventChangeDataSubscribtion = this.eventService.eventChangeData$.subscribe(data => {
      if (data) {
        this.loadData();
      }
    })
  }

  //receiving data of events and display it in fullcalendar
  loadData() {
    this.loadingService.show();
    this.eventService.getEvents(this.eventStatus).subscribe({
      next: events => {
        this.loadingService.hide();
        this.events = events;
        this.calendarOptions = {
          events: this.events
        };
      },
      error: err => {
        this.loadingService.hide();
        this.errorModal.openModal(err);
      }
    });
  }

  //getting data of event and pushing it to form
  getEvent(eventId: number) {
    this.loadingService.show();
    this.eventService.getEvent(eventId).subscribe({
      next: result => {
        this.loadingService.hide();
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
        this.loadingService.hide();
        this.errorModal.openModal(err);
      }
    });
  }

  //getting FormArray exercises
  get getExercise() {
    return this.detailsForm.get('exercises') as FormArray;
  }

  //change status of an event
  changeEventStatus(status: string) {
    this.loadingService.show();
    this.model.status = status;
    this.eventService.changeEventStatus(this.model).subscribe({
      next: result => {
        this.loadingService.hide();
        this.modalService.dismissAll();
        this.eventService.eventChangeData$.next(true);
      },
      error: err => {
        this.loadingService.hide();
        this.errorModal.openModal(err);
      }
    });
  }

  //Run timer by user start event
  startTimer() {
    if (!this.timerRunning) {
      this.timePaused = false;
      this.timerRunning = true;

      this.interval = setInterval(() => {
        this.countTimerStartValue += 1;
        this.displayTime = countupTimer(this.countTimerStartValue);
      }, 1000)
    }
  }

  //paused timer
  pauseTimer() {
    this.timePaused = true;
    this.timerRunning = false;

    clearInterval(this.interval);
  }

  //stop timer
  stopTimer() {
    this.timerRunning = false;
    this.displayTime = null;
    this.countTimerStartValue = 0;

    clearInterval(this.interval);
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

  //logout account
  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.isLoadingDataSubscribtion.unsubscribe();
    this.eventChangeDataSubscribtion.unsubscribe();
  }
}
