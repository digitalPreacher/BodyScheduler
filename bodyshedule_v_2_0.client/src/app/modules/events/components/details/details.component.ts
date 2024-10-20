import { Component, Input, TemplateRef, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { EventService } from '../../shared/event.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  providers: [DatePipe]
})
export class DetailsComponent {
  modalService = inject(NgbModal);
  detailsForm: FormGroup;

  @Input() eventId!: number;

  constructor(private eventService: EventService, private formBuilder: FormBuilder, private datePipe: DatePipe) {
    this.detailsForm = this.formBuilder.group({
      id: [''],
      title: [''],
      description: [''],
      startTime: [''],
      endTime: [''],
      exercises: this.formBuilder.array([])
    });
  }

  getEvent() {
    this.eventService.getEvent(this.eventId).subscribe({
      next: result => {
        const eventData = result[0];
        const currStartTime = this.datePipe.transform(eventData.startTime, 'yyyy-MM-ddTHH:mm');
        const currEndTime = this.datePipe.transform(eventData.endTime, 'yyyy-MM-ddTHH:mm');
        this.detailsForm.patchValue({
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          startTime: currStartTime,
          endTime: currEndTime,
        });

        const exercises = this.detailsForm.get('exercises') as FormArray;
        exercises.clear();

        eventData.exercises.forEach((exercise: { id: number; title: string; quantityApproaches: number; quantityRepetions: number; }) =>
        {
          exercises.push(this.formBuilder.group({
            id: [exercise.id],
            title: [exercise.title],
            quantityApproaches: [exercise.quantityApproaches],
            quantityRepetions: [exercise.quantityRepetions]
          }));
        })

      },
      error: err => {
        console.log(err);
      }
    });
  }

  get getExercise() {
    return this.detailsForm.get('exercises') as FormArray;
  }

  open(content: TemplateRef<any>) {
    this.getEvent();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

}
