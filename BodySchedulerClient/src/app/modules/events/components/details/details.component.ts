import { Component, Input, TemplateRef, ViewChild, inject, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { EventService } from '../../shared/event.service';
import { ChangeEventStatus } from '../../shared/change-event-status.model';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service';
import { EMPTY, Observable, Subject, Subscription, filter, interval, map, mapTo, merge, switchMap, switchMapTo, takeUntil, takeWhile, withLatestFrom } from 'rxjs';
import { countupTimer } from '../../../../utils/timer';
import { TrainingResult } from '../../shared/models/training-result.model';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { EventImpl } from '@fullcalendar/core/internal';
import { TrainingStateData } from '../../shared/models/training-state-data.model';
import { TrainingResultModalComponent } from '../../../shared/components/training-result-modal/training-result-modal.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  providers: [DatePipe]
})
export class DetailsComponent implements OnDestroy {
  eventChangeDataSubscribtion: any;
  isLoadingDataSubscribtion: any;
  eventDataSubscribtion!: any;
  modalService = inject(NgbModal);
  detailsForm: FormGroup;
  isLoading!: boolean;
  userDataSubscribtion: any;
  userId: string = '';
  displayTime: any;
  countdownSubscription: any;
  countTimerStartValue: number = 0;
  interval: any;
  timePaused = false;
  trainingResult: TrainingResult = new TrainingResult();
  trainingStateData: TrainingStateData = new TrainingStateData();
  trainingStateChangeDataSubscribtion: any;

  valueArray: any[] = []

  model: ChangeEventStatus = new ChangeEventStatus();

  @Input() eventId!: number;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;
  @ViewChild('trainingResultModal') trainingResultModal!: TrainingResultModalComponent;

  constructor(private eventService: EventService, private formBuilder: FormBuilder, private datePipe: DatePipe, private loadingService: LoadingService,
    private authService: AuthorizationService)
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

  //getting data of event and pushing it to form
  getEvent() {
    this.loadingService.show();

      this.eventService.getEvent(this.eventId).subscribe({
        next: result => {
          this.loadingService.hide();
          const eventData = result[0];
          const currStartTime = this.datePipe.transform(eventData.startTime, 'yyyy-MM-ddTHH:mm');
          this.detailsForm.patchValue({
            id: eventData.id,
            title: eventData.title,
            description: eventData.description,
            startTime: currStartTime,
            status: eventData.status,
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
          });
        },
        error: err => {
          this.loadingService.hide();
          this.errorModal.openModal(err);
        },
        complete: () => {
          this.setTrainingState(this.eventId);
        }
      });
  }

  //exercises FormArray getter
  get getExercise() {
    return this.detailsForm.get('exercises') as FormArray;
  }

  //change status of an event
  changeEventStatus(status: string) {
    this.model.id = this.eventId;
    this.model.status = status;
    this.eventService.changeEventStatus(this.model).subscribe({
      next: result => {
        this.modalService.dismissAll();
        this.eventService.eventChangeData$.next(true);

        if (this.model.status === 'completed') {
          this.setTrainingResult();
          this.stopTimer();
        }
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    });
  }

  //Run timer by user start event
  startTimer() {
    if (this.trainingStateData.state != 'Runned' && this.trainingStateData.state !== 'Paused' && this.trainingStateData.state !== 'Resumed') {
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
    if (localStorageStateData.state !== undefined) {
      this.trainingStateData.state = localStorageStateData.state;
      this.trainingStateData.seconds = localStorageStateData.seconds;
      this.setTotalSecondsForTimer(this.trainingStateData);
    }

    if (this.detailsForm.get('status')?.value === 'inProgress' && localStorageStateData.state === undefined) {
      this.trainingStateData = new TrainingStateData();
      this.updateTrainingState(eventId, this.trainingStateData);
      this.setTotalSecondsForTimer(this.trainingStateData);
    }
  }

  //update training state in localstorage
  updateTrainingState(eventId: number, updateTrainingStateData?: TrainingStateData) {
    localStorage.setItem(`state_training_id_${this.eventId}`, JSON.stringify(updateTrainingStateData));
  }

  //open event modal form
  open(content: TemplateRef<any>) {
    this.getEvent();
    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };
    this.modalService.open(content, options);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.isLoadingDataSubscribtion.unsubscribe();
  }
}
