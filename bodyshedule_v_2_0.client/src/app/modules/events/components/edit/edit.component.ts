import { Component, Input, Output, TemplateRef, inject } from '@angular/core';
import { EventService } from '../../shared/event.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Event } from '../../shared/event.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styles: ``,
  providers: [DatePipe]
})
export class EditComponent {
  userDataSubscribtion: any;
  modalService = inject(NgbModal);
  userId: any;
  title: string = '';
  createForm: FormGroup;
 

  @Output() submittedClick = false;

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
      endTime: ['', Validators.required],
      exercises: this.formBuilder.array([])
    });
  }

  saveEvent() {
    if (this.createForm.valid) {
      const currStartTime = this.datePipe.transform(this.createForm.get('startTime')?.value, 'yyyy-MM-ddTHH:mm:ss.ssS', 'UTC') + 'Z';
      const currEndTime = this.datePipe.transform(this.createForm.get('endTime')?.value, 'yyyy-MM-ddTHH:mm:ss.ssS', 'UTC') + 'Z';
      this.createForm.patchValue({
        startTime: currStartTime,
        endTime: currEndTime
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

  getEvent() {
    this.eventService.getEvent(this.eventId).subscribe({
      next: result => {
        const eventData = result[0];
        const currStartTime = this.datePipe.transform(eventData.startTime, 'yyyy-MM-ddTHH:mm');
        const currEndTime = this.datePipe.transform(eventData.endTime, 'yyyy-MM-ddTHH:mm');
        this.createForm.patchValue({
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          startTime: currStartTime,
          endTime: currEndTime
        })

        const exercises = this.createForm.get('exercises') as FormArray;
        exercises.clear();

        eventData.exercises.forEach((exercise: { id: number; title: string; quantityApproaches: number; quantityRepetions: number; }) => {
          exercises.push(this.formBuilder.group({
            id: [exercise.id],
            title: [exercise.title],
            quantityApproaches: [exercise.quantityApproaches],
            quantityRepetions: [exercise.quantityRepetions]
          }))
        });
      },
      error: err => {
        console.log(err);
      }
    });
  }

  get getExercise() {
    return this.createForm.get('exercises') as FormArray;
  }

  addField() {
    const formGroup = this.createdItem();
    const exercises = this.createForm.get('exercises') as FormArray;
    exercises.push(formGroup);
  }

  createdItem(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      quantityApproaches: [0, Validators.required],
      quantityRepetions: [0, Validators.required]
    })
  }

  removeField(id: number) {
    const exercises = this.createForm.get('exercises') as FormArray;
    exercises.removeAt(id);
    console.log("remove item with id: " + id);
  }

  open(content: TemplateRef<any>) {
    this.getEvent();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

}
