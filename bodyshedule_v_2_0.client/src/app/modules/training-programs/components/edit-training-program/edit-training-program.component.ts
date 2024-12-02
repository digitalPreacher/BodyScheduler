import { Component, Input, OnInit, TemplateRef, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TrainingProgramService } from '../../shared/training-program.service';
import { EventService } from '../../../events/shared/event.service';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';

@Component({
  selector: 'app-edit-training-program',
  templateUrl: './edit-training-program.component.html',
  styles: ``,
  providers: [DatePipe]
})
export class EditTrainingProgramComponent implements OnInit {
  modalService = inject(NgbModal);
  editForm: FormGroup;
  userDataSubscribtion: any;
  userId = '';
  listValue: string[] = [];
  filterListValue: any[] = [];

  @Input() programId!: number;

  constructor(private trainingProgramService: TrainingProgramService, private formBuilder: FormBuilder, private datePipe: DatePipe, private eventService: EventService, private authService: AuthorizationService) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    });

    this.editForm = this.formBuilder.group({
      userId: [this.userId, Validators.required],
      id: [0, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      weeks: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.getTrainingProgram();

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
    this.trainingProgramService.getTrainingProgram(this.programId).subscribe({
      next: result => {
        const eventData = result[0];
        this.editForm.patchValue({
          id: eventData.id,
          title: eventData.title,
          description: eventData.description
        });

        //push every week to form
        eventData.weeks.forEach((week: { id: number, weekNumber: number }) => {
          this.weeks.push(this.formBuilder.group({
            id: week.id, 
            weekNumber: week.weekNumber,
            events: this.formBuilder.array([])
          }))
        });

        //push events and exercise arrays to form
        for (let i = 0; i < eventData.weeks.length; i++) {
          const events = this.getEventsFormArray(i);

          for (let j = 0; j < eventData.weeks[i].events.length; j++) {
            events.push(this.formBuilder.group({
              id: eventData.weeks[i].events[j].id,
              title: eventData.weeks[i].events[j].title,
              description: eventData.weeks[i].events[j].description,
              status: eventData.weeks[i].events[j].status,
              startTime: this.datePipe.transform(eventData.weeks[i].events[j].startTime, 'yyyy-MM-ddTHH:mm'),
              exercises: this.formBuilder.array([])
            }));

            for (let k = 0; k < eventData.weeks[i].events[j].exercises.length; k++) {
              const exercises = this.getExercisesFormArray(i, j);
              exercises.push(this.formBuilder.group({
                id: eventData.weeks[i].events[j].exercises[k].id,
                title: eventData.weeks[i].events[j].exercises[k].title,
                quantityApproaches: eventData.weeks[i].events[j].exercises[k].quantityApproaches,
                quantityRepetions: eventData.weeks[i].events[j].exercises[k].quantityRepetions,
                weight: eventData.weeks[i].events[j].exercises[k].weight,
              }))
            }
          }
        }
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
      description: ['', Validators.required],
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
      for (let i = 0; i < this.weeks.length; i++) {
        const events = this.getEventsFormArray(i);
        events.controls.forEach((e) => {
          const currStartTime = this.datePipe.transform(e.get('startTime')?.value, 'yyyy-MM-ddTHH:mm:ss.ssS', 'UTC') + 'Z';
          e.get('startTime')?.setValue(currStartTime);
        })
      }
      this.trainingProgramService.editTrainingProgram(this.editForm.value).subscribe({
        next: result => {
          this.modalService.dismissAll();
          this.eventService.eventChangeData$.next(true);
          this.trainingProgramService.programChangeData$.next(true);
          console.log(this.editForm.value);
        },
        error: err => {
          console.log(err);
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
