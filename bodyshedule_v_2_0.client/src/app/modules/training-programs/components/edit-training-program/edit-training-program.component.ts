import { Component, Input, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TrainingProgramService } from '../../shared/training-program.service';
import { EventService } from '../../../events/shared/event.service';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { Title } from '@angular/platform-browser';
import { LoadingService } from '../../../shared/service/loading.service';

@Component({
  selector: 'app-edit-training-program',
  templateUrl: './edit-training-program.component.html',
  styles: ``,
  providers: [DatePipe]
})
export class EditTrainingProgramComponent implements OnInit {
  isLoading: any;
  isLoadingDataSubscribtion: any;
  userDataSubscribtion: any;
  modalService = inject(NgbModal);
  editForm: FormGroup;
  userId = '';
  listValue: string[] = [];
  filterListValue: any[] = [];

  @Input() programId!: number;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private trainingProgramService: TrainingProgramService, private formBuilder: FormBuilder,
    private datePipe: DatePipe, private eventService: EventService, private authService: AuthorizationService,
    private loadingService: LoadingService) {

    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    });

    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

    this.editForm = this.formBuilder.group({
      userId: [this.userId, Validators.required],
      id: [0, Validators.required],
      title: ['', Validators.required],
      description: [''],
      weeks: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.eventService.getExerciseTitles().subscribe(data => {
      this.listValue = data;
    });
  }

  //Enter value to input field for title of exercise
  enterKeyUp(enterValue: string) {
    this.filterListValue = this.listValue.filter(value =>
      value.toLowerCase().includes(enterValue.toLowerCase()));
  }


  //getting data of training program
  getTrainingProgram() {
    this.loadingService.show();
    this.trainingProgramService.getTrainingProgram(this.programId).subscribe({
      next: result => {
        this.loadingService.hide();
        const eventData = result[0];
        this.editForm.patchValue({
          id: eventData.id,
          title: eventData.title,
          description: eventData.description
        });

        //clear all controls to weeks
        this.weeks.clear();


        eventData.weeks.forEach((week: { id: number, weekNumber: number, events: [] }, weekIndex: number) => {
          this.weeks.push(this.formBuilder.group({
            id: week.id,
            weekNumber: week.weekNumber,
            events: this.formBuilder.array([])
          }))

          week.events.forEach((event: { id: number, title: string, description: string, status: string, startTime: string, exercises: [] }, eventIndex: number) => {
            const array = this.weeks.controls[weekIndex].get('events') as FormArray;
            array.push(this.formBuilder.group({
              id: event.id,
              title: event.title,
              description: event.description,
              status: event.status,
              startTime: this.datePipe.transform(event.startTime, 'yyyy-MM-ddTHH:mm'),
              exercises: this.formBuilder.array([])
            }))

            event.exercises.forEach((exercise: { id: number, title: string, quantityApproaches: number, quantityRepetions: number, weight: number }) => {
              const exerciseArray = array.controls[eventIndex].get('exercises') as FormArray;
              exerciseArray.push(this.formBuilder.group({
                id: exercise.id,
                title: exercise.title,
                quantityApproaches: exercise.quantityApproaches,
                quantityRepetions: exercise.quantityRepetions,
                weight: exercise.weight
              }))
            })
          })
        });
      },
      error: err => {
        this.loadingService.hide()
        this.errorModal.openModal(err);
      }
    })
  }

  //return FormGroup of weeks fiels for adding to edit form
  addWeeksFields(): FormGroup {
    return this.formBuilder.group({
      weekNumber: [this.weeks.length + 1, Validators.required],
      events: this.formBuilder.array([])
    })
  }

  //adding a week to edit form
  addWeeks() {
    const formGroup = this.addWeeksFields();
    this.weeks.push(formGroup);
  }

  //getter a weeks
  get weeks(): FormArray {
    return this.editForm.get('weeks') as FormArray;
  }

  //removing a week from edit form
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
      id: [0,Validators.required ],
      title: ['', Validators.required],
      description: [''],
      startTime: ['', Validators.required],
      status: ['inProgress', Validators.required],
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

  getEventsControls(weekIndex: number) {
    return this.getEventsFormArray(weekIndex).controls;
  }

  //remove event from edit form
  removeEvent(weekIndex: number, eventIndex: number) {
    const events = this.getEventsFormArray(weekIndex);
    events.removeAt(eventIndex);
  }

  //return FormArray of exercises 
  getExercisesFormArray(weekIndex: number, eventIndex: number) {
    return this.getEventsFormArray(weekIndex).controls[eventIndex].get('exercises') as FormArray;
  }

  //return an array of exercise controls
  getExercisesControls(weekIndex: number, eventIndex: number) {
    return this.getExercisesFormArray(weekIndex, eventIndex).controls;
  }

  //return FormGroup of exercise for added to edit form
  addExercisesFields(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      quantityApproaches: [0, Validators.required],
      quantityRepetions: [0, Validators.required],
      weight: [0, Validators.required]
    })
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

  //sending data to backend
  edit() {
    if (this.editForm.valid) {
      this.loadingService.show();
      for (let i = 0; i < this.weeks.length; i++) {
        const events = this.getEventsFormArray(i);
        events.controls.forEach((e) => {
          const currStartTime = this.datePipe.transform(e.get('startTime')?.value, 'yyyy-MM-ddTHH:mm:ss.ssS', 'UTC') + 'Z';
          e.get('startTime')?.setValue(currStartTime);
        })
      }
      this.trainingProgramService.editTrainingProgram(this.editForm.value).subscribe({
        next: result => {
          this.loadingService.hide();
          this.modalService.dismissAll();
          this.eventService.eventChangeData$.next(true);
          this.trainingProgramService.programChangeData$.next(true);
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
      size: 'md',
      ariaLabelledBy: 'modal-basic-title'
    };
    this.getTrainingProgram();
    this.modalService.open(content, options);
  }

  //opening modal window which displays data of training days 
  openDays(content: TemplateRef<any>) {
    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };
    this.modalService.open(content, options);
  }


}
