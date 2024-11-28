import { Component, Input, Output, TemplateRef, inject , OnInit} from '@angular/core';
import { EventService } from '../../shared/event.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Event } from '../../shared/event.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styles: ``,
  providers: [DatePipe]
})
export class EditComponent implements OnInit {
  userDataSubscribtion: any;
  modalService = inject(NgbModal);
  userId: any;
  title: string = '';
  createForm: FormGroup;
  listValue: string[] = [];
  filterListValue: any[] = [];
 

  submittedClick = false;

  @Input() eventId!: number;
  

  constructor(private eventService: EventService, private formBuilder: FormBuilder,
    private authService: AuthorizationService, private datePipe: DatePipe) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    });
    this.createForm = this.formBuilder.group({
      userId: [this.userId, Validators.required],
      id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      startTime: ['', Validators.required],
      status: ['', Validators.required],
      exercises: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.eventService.getExerciseTitles().subscribe(data => {
      this.listValue = data;
    });
  }

  //send data to backend
  saveEvent() {
    if (this.createForm.valid) {
      const currStartTime = this.datePipe.transform(this.createForm.get('startTime')?.value, 'yyyy-MM-ddTHH:mm:ss.ssS', 'UTC') + 'Z';
      this.createForm.patchValue({
        startTime: currStartTime,
      });
      this.eventService.editEvent(this.createForm.value).subscribe({
        next: result => {
          this.submittedClick = false;
          this.modalService.dismissAll();
          this.eventService.eventChangeData$.next(true);
        },
        error: err => {
          console.log(err)
        }
      });
    }
  }

  //Enter value to input field for title of exercise
  enterKeyUp(enterValue: string) {
    this.filterListValue = this.listValue.filter(value =>
      value.toLowerCase().includes(enterValue.toLowerCase()));
  }

  //getting data of event and pushing it to form
  getEvent() {
    this.eventService.getEvent(this.eventId).subscribe({
      next: result => {
        const eventData = result[0];
        const currStartTime = this.datePipe.transform(eventData.startTime, 'yyyy-MM-ddTHH:mm');
        this.createForm.patchValue({
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          startTime: currStartTime,
          status: eventData.status
        });

        const exercises = this.createForm.get('exercises') as FormArray;
        exercises.clear();

        eventData.exercises.forEach((exercise: { id: number; title: string; quantityApproaches: number; quantityRepetions: number; weight: number }) => {
          exercises.push(this.formBuilder.group({
            id: [exercise.id],
            title: [exercise.title],
            quantityApproaches: [exercise.quantityApproaches],
            quantityRepetions: [exercise.quantityRepetions],
            weight: [exercise.weight]
          }))
        });
      },
      error: err => {
        console.log(err);
      }
    });
  }

  //exercise FormArray getter
  get getExercise() {
    return this.createForm.get('exercises') as FormArray;
  }


  //add additional exercise fields to form
  addField() {
    const formGroup = this.createdItem();
    const exercises = this.createForm.get('exercises') as FormArray;
    exercises.push(formGroup);
  }

  //return exercise FormGroup
  createdItem(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      quantityApproaches: [0, Validators.required],
      quantityRepetions: [0, Validators.required],
      weight: [0, Validators.required]
    })
  }

  //remove exercise fields to form
  removeField(id: number) {
    const exercises = this.createForm.get('exercises') as FormArray;
    exercises.removeAt(id);
    console.log("remove item with id: " + id);
  }

  //open modal form
  open(content: TemplateRef<any>) {
    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };
    this.getEvent();
    this.modalService.open(content, options);
  }

}
