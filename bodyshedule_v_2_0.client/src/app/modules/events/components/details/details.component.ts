import { Component, Input, TemplateRef, ViewChild, inject, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { EventService } from '../../shared/event.service';
import { ChangeEventStatus } from '../../shared/change-event-status.model';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  providers: [DatePipe]
})
export class DetailsComponent implements OnDestroy {
  isLoadingDataSubscribtion: any;
  modalService = inject(NgbModal);
  detailsForm: FormGroup;
  isLoading!: boolean;

  model: ChangeEventStatus = new ChangeEventStatus();

  @Input() eventId!: number;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private eventService: EventService, private formBuilder: FormBuilder, private datePipe: DatePipe, private loadingService: LoadingService) {
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
          status: eventData.status
        });

        const exercises = this.detailsForm.get('exercises') as FormArray;

        exercises.clear();

        //pushing each exercise to form
        eventData.exercises.forEach((exercise: { id: number; title: string; quantityApproaches: number; quantityRepetions: number; weight: number }) =>
        {
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

  //exercises FormArray getter
  get getExercise() {
    return this.detailsForm.get('exercises') as FormArray;
  }

  //change status of an event
  changeEventStatus(status: string) {
    this.model.id = this.eventId!;
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

  //open modal form
  open(content: TemplateRef<any>) {
    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };
    this.getEvent();
    this.modalService.open(content, options);
  }

  ngOnDestroy() {
    this.isLoadingDataSubscribtion.unsubscribe();
  }

}
