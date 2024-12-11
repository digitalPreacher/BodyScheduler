import { Component, Output, inject, TemplateRef, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, Form } from '@angular/forms';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { TrainingProgramService } from '../../shared/training-program.service';
import { EventService } from '../../../events/shared/event.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service';


@Component({
  selector: 'app-create-training-program',
  templateUrl: './create-training-program.component.html',
  styles: ``,
  providers: [DatePipe]
})
export class CreateTrainingProgramComponent implements OnDestroy {
  modalService = inject(NgbModal);
  userDataSubscribtion: any;
  isLoading: any;
  isLoadingDataSubscribtion: any;
  userId: string = '';
  createForm: FormGroup;
  listValue: string[] = [];
  filterListValue: any[] = [];

  submittedClick = false;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private programService: TrainingProgramService, private formBuilder: FormBuilder,
    private authService: AuthorizationService, private datePipe: DatePipe, private eventService: EventService,
    private loadingService: LoadingService)
  {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    });

    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

    this.createForm = this.formBuilder.group({
      userId: [this.userId, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      weeks: this.formBuilder.array([])
    })

    this.eventService.getExerciseTitles().subscribe(data => {
      this.listValue = data;
    });

  }

  //Enter value to input field for title of exercise
  enterKeyUp(enterValue: string) {
    this.filterListValue = this.listValue.filter(value =>
      value.toLowerCase().includes(enterValue.toLowerCase()));
  }

  //return FormGroup of weeks fiels for adding to create form
  addWeeksFields(): FormGroup {
    return this.formBuilder.group({
      weekNumber: [this.weeks.length + 1, Validators.required],
      events: this.formBuilder.array([])
    })
  }

  //adding a week to create form
  addWeeks() {
    const formGroup = this.addWeeksFields();
    this.weeks.push(formGroup);
  }

  //getter a weeks
  get weeks(): FormArray {
    return this.createForm.get('weeks') as FormArray;
  }

  //removing a week from create form
  removeWeek(weekIndex: number) {

    for (let i = weekIndex + 1; i < this.weeks.length; i++) {
      const week = this.weeks.controls[i];
      const currentValue = week.get('weekNumber')?.value;
      week.get('weekNumber')?.setValue(currentValue - 1)
    }

    this.weeks.removeAt(weekIndex);
  }

  //return form group of event for adding in array of events to week
  addEventsField(): FormGroup {
    return this.formBuilder.group({
      userId: [this.userId, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      startTime: ['', Validators.required],
      exercises: this.formBuilder.array([])
    })
  }

  //adding fields of event to event form
  addEvent(weekIndex: number) {
    this.getEventsFormArray(weekIndex).push(this.addEventsField());
  }

  //return FormArray of events 
  getEventsFormArray(weekIndex: number) {
    return this.weeks.controls[weekIndex].get('events') as FormArray;
  }

  //return an array of events controls
  getEventsControls(weekIndex: number) {
    return this.getEventsFormArray(weekIndex).controls;
  }

  //remove event from create form
  removeEvent(weekIndex: number, eventIndex: number) {
    const events = this.getEventsFormArray(weekIndex);
    events.removeAt(eventIndex);
  }

  //return FormGroup of exercise for added to create form
  addExercisesFields(): FormGroup{
    return this.formBuilder.group({
      title: ['', Validators.required],
      quantityApproaches: [0, Validators.required],
      quantityRepetions: [0, Validators.required],
      weight: [0, Validators.required]
    })
  }

  //return FormArray of exercises
  getExercisesFormArray(weekIndex: number, eventIndex: number) {
    return this.getEventsFormArray(weekIndex).controls[eventIndex].get('exercises') as FormArray;
  }

  //return an array of exercise controls
  getExercisesControls(weekIndex: number, eventIndex: number) {
    return this.getExercisesFormArray(weekIndex, eventIndex).controls;
  }

  //adding an exercise to event form
  addExecise(weekIndex: number, eventIndex: number) {
    this.getExercisesFormArray(weekIndex, eventIndex).push(this.addExercisesFields());
  }

  //removing an exercise field from event form
  removeExercisesField(weekIndex: number, eventIndex: number, exerciseIndex: number) {
    const exercises = this.getExercisesFormArray(weekIndex, eventIndex);
    exercises.removeAt(exerciseIndex);
  }

  //retrun default create form
  setDefaultCreateForm() {
    return this.formBuilder.group({
      userId: [this.userId, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      weeks: this.formBuilder.array([])
    });
  }

  //sending data to backend
  create() {
    if (this.createForm.valid) {
      this.loadingService.show();
      for (let i = 0; i < this.weeks.length; i++) {
        const events = this.getEventsFormArray(i);
        events.controls.forEach((e) => {
          const currStartTime = this.datePipe.transform(e.get('startTime')?.value, 'yyyy-MM-ddTHH:mm:ss.ssS', 'UTC') + 'Z';
          e.get('startTime')?.setValue(currStartTime);
        })

      }
      this.programService.addTrainingProgram(this.createForm.value).subscribe({
        next: result => {
          this.loadingService.hide();
          this.modalService.dismissAll();
          this.eventService.eventChangeData$.next(true);
          this.programService.programChangeData$.next(true);
          this.resetForm();
        },
        error: err => {
          this.loadingService.hide();
          this.errorModal.openModal(err);
        }
      })
    }
  }

  //opening modal window of training program form 
  openMain(content: TemplateRef<any>) {
    const options: NgbModalOptions = {
      size: 'xs',
      ariaLabelledBy: 'modal-basic-title'
    };
    this.modalService.open(content, options);
  }

  resetForm() {
    const defaultCreateForm = this.setDefaultCreateForm();
    this.submittedClick = false;
    this.createForm = defaultCreateForm;
  }

  //opening modal window adding of training days 
  openDays(content: TemplateRef<any>) {
    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };
    this.modalService.open(content, options);
  }

  ngOnDestroy() {
    this.isLoadingDataSubscribtion.unsubscribe();
    this.userDataSubscribtion.unsubscribe();
  }
}
