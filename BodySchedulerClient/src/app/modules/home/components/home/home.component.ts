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
import { pipe, switchMap, tap } from 'rxjs';
import { Event } from '../../../events/shared/event.model';
import { ChangeEventStatus } from '../../../events/shared/change-event-status.model';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service';
import { countupTimer } from '../../../../utils/timer';
import { TrainingResult } from '../../../events/shared/models/training-result.model';
import { DetailsComponent } from '../../../events/components/details/details.component';
import { TrainingStateData } from '../../../events/shared/models/training-state-data.model';
import { TrainingResultModalComponent } from '../../../shared/components/training-result-modal/training-result-modal.component';
import { UpdateAchievementService } from '../../../shared/service/update-achievement.service';
import { ExperienceBarService } from '../../../experience-bar/shared/experience-bar.service';


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
  protected displayTime: any;
  userDataSubscribtion: any;
  userId: string = '';
  trainingResult: TrainingResult = new TrainingResult();
  trainingStateData: TrainingStateData = new TrainingStateData();
  eventId!: number;


  detailsForm: FormGroup;

  modalService = inject(NgbModal);
  updateAchievementService = inject(UpdateAchievementService);
  userExperienceBarService = inject(ExperienceBarService);

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;
  @ViewChild('trainingResultModal') trainingResultModal!: TrainingResultModalComponent;

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
      private loadingService: LoadingService)
  {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    });

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
    this.loadingService.show()
    this.model.id = this.eventId;
    this.model.status = status;

    if (status === 'completed') {
      this.eventService.changeEventStatus(this.model)
        .pipe(
          switchMap(() => {
            //increment user experience
            return this.userExperienceBarService.incrementUserExperience(this.userId);
          }),
          switchMap(() => {
            //update user achievement
            return this.updateAchievementService.updateAchievement(this.userId, [AchievementName.beginner, AchievementName.young, AchievementName.continuing, AchievementName.athlete, AchievementName.universe]);
          }),
          tap(() => {
            this.setTrainingResult();

            this.stopTimer();

            this.modalService.dismissAll();
            this.userExperienceBarService.userExperienceChangeData$.next(true);
            this.eventService.eventChangeData$.next(true);
            this.loadingService.hide();
          })
        )
        .subscribe({
          error: err => {
            this.errorModal.openModal(err);
            this.loadingService.hide();
          }
        });
    }
    else {
      this.eventService.changeEventStatus(this.model)
        .pipe(
          tap(() => {
            this.loadingService.hide();
            this.modalService.dismissAll();
            this.eventService.eventChangeData$.next(true);
          })
        )
        .subscribe({
          error: err => {
            this.loadingService.hide();
            this.errorModal.openModal(err);
          }
        });
    }
  }

  //Run timer by user start event
  startTimer() {
    if (this.trainingStateData.state != 'Runned') {
      clearInterval(this.interval)
      this.trainingStateData.state = 'Runned'
      this.updateTrainingState(this.eventId, this.trainingStateData);


      this.interval = setInterval(() => {
        this.countTimerStartValue += 1;
        this.displayTime = countupTimer(this.countTimerStartValue);

        //saved state in localstorage
        this.trainingStateData.seconds = this.countTimerStartValue;
        this.updateTrainingState(this.eventId, this.trainingStateData);

      }, 1000)
    }
  }

  //paused timer
  pauseTimer() {
    if (this.trainingStateData.state !== 'Paused') {
      this.trainingStateData.state = 'Paused'
      this.trainingStateData.seconds = this.countTimerStartValue;
      this.updateTrainingState(this.eventId, this.trainingStateData);

      this.displayTime = countupTimer(this.countTimerStartValue);
      clearInterval(this.interval);
    }
  }

  //resumed timer 
  resumeTimer() {
    if (this.trainingStateData.state !== 'Resumed' && this.trainingStateData.state !== 'Runned') {
      this.trainingStateData.state = 'Resumed';
      this.updateTrainingState(this.eventId, this.trainingStateData);
      this.countTimerStartValue = this.trainingStateData.seconds;

      this.interval = setInterval(() => {
        this.countTimerStartValue += 1;
        this.displayTime = countupTimer(this.countTimerStartValue);

        //saved state in localstorage
        this.trainingStateData.seconds = this.countTimerStartValue;
        this.updateTrainingState(this.eventId, this.trainingStateData);
      }, 1000)
    }
  }

  //stop timer
  stopTimer() {
    this.trainingStateData.state = 'Stopped';
    this.updateTrainingState(this.eventId, this.trainingStateData);

    clearInterval(this.interval)
    setTimeout(() => {
      localStorage.removeItem(`state_training_id_${this.eventId}`);
    }, 100);
    
  }

  //add training result for congratulation users
  setTrainingResult() {
    this.trainingResult.eventId = this.eventId;
    this.trainingResult.userId = this.userId;
    this.trainingResult.trainingTime = this.displayTime;
    this.trainingResult.amountWeight = 0;
    this.getExercise.controls.forEach(control => {
      this.trainingResult.amountWeight += (control.get('quantityApproaches')?.value * control.get('quantityRepetions')?.value * control.get('weight')?.value);
    });

    this.eventService.addTrainingResult(this.trainingResult).subscribe({
      next: result => {
        this.trainingResultModal.openModal(this.trainingResult);
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    });
  }

  //set value to displayTime and running timer
  setTotalSecondsForTimer(trainingState: TrainingStateData) {
    if (trainingState.state !== 'Stopped') {
      clearInterval(this.interval)
      if (trainingState.state !== 'Paused') {
        this.countTimerStartValue = trainingState.seconds;

        this.interval = setInterval(() => {
          this.countTimerStartValue += 1;
          this.displayTime = countupTimer(this.countTimerStartValue);

          //saved state in localstorage
          this.trainingStateData.seconds = this.countTimerStartValue;
          this.updateTrainingState(this.eventId, this.trainingStateData);
        }, 1000)
      }

      this.countTimerStartValue = trainingState.seconds;
      this.displayTime = countupTimer(this.countTimerStartValue);
    }
    else {
      clearInterval(this.interval)
      this.countTimerStartValue = trainingState.seconds;
      this.displayTime = countupTimer(this.countTimerStartValue);
    }
  }

  //get training state from localstorage
  getTrainingState(eventId: number) {
    return localStorage.getItem(`state_training_id_${this.eventId}`);
  }


  //set training state data based on data from localstorage
  setTrainingState(eventId: number) {
    const localStorageStateData = JSON.parse(this.getTrainingState(eventId) || '[]');
    if (localStorageStateData.state != undefined ) {
      this.trainingStateData.state = localStorageStateData.state;
      this.trainingStateData.seconds = localStorageStateData.seconds;
      this.setTotalSecondsForTimer(this.trainingStateData);
    }
    else {
      this.trainingStateData = new TrainingStateData();
      this.updateTrainingState(eventId, this.trainingStateData);
      this.setTotalSecondsForTimer(this.trainingStateData);
    }
  }

  //update training state in localstorage
  updateTrainingState(eventId: number, updateTrainingStateData: TrainingStateData) {
    localStorage.setItem(`state_training_id_${this.eventId}`, JSON.stringify(updateTrainingStateData));
  }

  //open event modal
  open(content: TemplateRef<any>, eventId: number) {
    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };

    this.eventId = eventId;
    this.setTrainingState(eventId);
    this.getEvent(eventId);
    this.modalService.open(content, options);
  }

  //logout account
  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.isLoadingDataSubscribtion.unsubscribe();
    this.eventChangeDataSubscribtion.unsubscribe();
  }
}

enum AchievementName {
  beginner = "Новичок",
  young = "Юноша",
  continuing = "Продолжающий",
  athlete = "Атлет",
  universe = "Вселенная",
}
