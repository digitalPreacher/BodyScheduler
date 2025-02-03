import { Component, Input, TemplateRef, inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TrainingProgramService } from '../../shared/training-program.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service';
import { Event } from '../../../events/shared/interfaces/event.interface';
import { Exercise } from '../../../events/shared/interfaces/exercise.interface';

@Component({
  selector: 'app-details-training-program',
  templateUrl: './details-training-program.component.html',
  styles: ``,
  providers: [DatePipe]
})
export class DetailsTrainingProgramComponent implements OnInit, OnDestroy {
  isLoading!: any;
  isLoadingDataSubscribtion: any;
  modalService = inject(NgbModal);
  detailsForm: FormGroup;

  @Input() programId!: number;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private trainingProgramService: TrainingProgramService, private formBuilder: FormBuilder,
    private datePipe: DatePipe, private loadingService: LoadingService) {

    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

    this.detailsForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      weeks: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    
  }

  //getting data of training program
  getTrainingProgram() {
    this.loadingService.show();
    console.log('test')
    this.trainingProgramService.getTrainingProgram(this.programId).subscribe({
      next: result => {
        this.loadingService.hide();
        const eventData = result[0];
        console.log(eventData);
        this.detailsForm.patchValue({
          title: eventData.title,
          description: eventData.description
        });

        //clear all controls to weeks
        this.weeks.clear();

        //push every week to form
        eventData.weeks.forEach((week: { id: number, weekNumber: number, events?: Event[] }, weekIndex: number) => {
          this.weeks.push(this.formBuilder.group({
            weeksNumber: week.weekNumber,
            events: this.formBuilder.array([])
          }));

          week.events?.forEach((event: { id?: number, title: string, description: string, status: string, startTime: string, exercises: Exercise[] }, eventIndex: number) => {
            const array = this.weeks.controls[weekIndex].get('events') as FormArray;
            array.push(this.formBuilder.group({
              id: event.id,
              title: event.title,
              description: event.description,
              status: event.status,
              startTime: this.datePipe.transform(event.startTime, 'yyyy-MM-ddTHH:mm'),
              exercises: this.formBuilder.array([])
            }))

            event.exercises?.forEach((exercise: { id: number, title: string, quantityApproaches: number, quantityRepetions: number, weight: number }) => {
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
        this.loadingService.hide();
        this.errorModal.openModal(err);
      }
    })
  }

  //getter a weeks
  get weeks(): FormArray {
    return this.detailsForm.get('weeks') as FormArray;
  }

  //return FormArray of events 
  getEventsFormArray(weekIndex: number) {
    return this.weeks.controls[weekIndex].get('events') as FormArray;
  }

  //return events contorls
  getEventsControls(weekIndex: number) {
    return this.getEventsFormArray(weekIndex).controls;
  }

  //return FormArray of exercises 
  getExercisesFormArray(weekIndex: number, eventIndex: number) {
    return this.getEventsFormArray(weekIndex).controls[eventIndex].get('exercises') as FormArray;
  }

  //return an array of exercise controls
  getExercisesControls(weekIndex: number, eventIndex: number) {
    return this.getExercisesFormArray(weekIndex, eventIndex).controls;
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

  ngOnDestroy() {
    this.isLoadingDataSubscribtion.unsubscribe();
  }
}
