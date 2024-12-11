import { Component, Input, TemplateRef, inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TrainingProgramService } from '../../shared/training-program.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service';

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
        this.detailsForm.patchValue({
          title: eventData.title,
          description: eventData.description
        });

        //push every week to form
        eventData.weeks.forEach((week: { weekNumber: number }) => {
          this.weeks.push(this.formBuilder.group({
            weeksNumber: week.weekNumber,
            events: this.formBuilder.array([])
          }))
        });

        //push events and exercise arrays to form
        for (let i = 0; i < eventData.weeks.length; i++) {
          const events = this.getEventsFormArray(i);

          for (let j = 0; j < eventData.weeks[i].events.length; j++) {
            events.push(this.formBuilder.group({
              title: eventData.weeks[i].events[j].title,
              description: eventData.weeks[i].events[j].description,
              startTime: this.datePipe.transform(eventData.weeks[i].events[j].startTime, 'yyyy-MM-ddTHH:mm'),
              exercises: this.formBuilder.array([])
            }));

            for (let k = 0; k < eventData.weeks[i].events[j].exercises.length; k++) {
              const exercises = this.getExercisesFormArray(i, j);
              exercises.push(this.formBuilder.group({
                title: eventData.weeks[i].events[j].exercises[k].title,
                quantityApproaches: eventData.weeks[i].events[j].exercises[k].quantityApproaches,
                quantityRepetions: eventData.weeks[i].events[j].exercises[k].quantityRepetions,
                weight: eventData.weeks[i].events[j].exercises[k].weight,
              }))
            }
          }
        }
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
