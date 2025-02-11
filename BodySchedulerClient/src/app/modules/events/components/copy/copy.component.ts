import { Component, Input, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { ChangeEventStatus } from '../../shared/change-event-status.model';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { EventService } from '../../shared/event.service';
import { LoadingService } from '../../../shared/service/loading.service';
import { DatePipe } from '@angular/common';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { ExerciseTitleSearch } from '../../../shared/classes/exercise-title-search';

@Component({
  selector: 'app-copy',
  templateUrl: './copy.component.html',
  styleUrl: './copy.component.css',
  providers: [DatePipe]
})
export class CopyComponent extends ExerciseTitleSearch implements OnInit {
  isLoadingDataSubscribtion: any;
  userDataSubscribtion: any;
  titleDataSubscribtion: any;
  modalService = inject(NgbModal);
  userId: any;
  title: string = '';
  copyForm: FormGroup;
  isLoading!: boolean;


  submittedClick = false;

  @Input() eventId!: number;
  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private eventService: EventService, private formBuilder: FormBuilder,
    private authService: AuthorizationService, private datePipe: DatePipe, private loadingService: LoadingService)
  {
    super(eventService);

    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    });

    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

    this.copyForm = this.formBuilder.group({
      userId: [this.userId, Validators.required],
      title: ['', Validators.required],
      description: [''],
      startTime: ['', Validators.required],
      status: ['', Validators.required],
      exercises: this.formBuilder.array([])
    });
  }

  //send data to backend
  saveEvent() {
    if (this.copyForm.valid) {
      this.loadingService.show();
      const currStartTime = this.datePipe.transform(this.copyForm.get('startTime')?.value, 'yyyy-MM-ddTHH:mm:ss.ssS', 'UTC') + 'Z';
      this.copyForm.patchValue({
        startTime: currStartTime,
      });
      this.eventService.addEvent(this.copyForm.value).subscribe({
        next: result => {
          this.loadingService.hide();
          this.submittedClick = false;
          this.modalService.dismissAll();
          this.eventService.eventChangeData$.next(true);
        },
        error: err => {
          this.loadingService.hide();
          this.errorModal.openModal(err);
        }
      });
    }
  }

  //getting data of event and pushing it to form
  getEvent() {
    this.loadingService.show();
    this.eventService.getEvent(this.eventId).subscribe({
      next: result => {
        this.loadingService.hide();
        const eventData = result[0];
        const currStartTime = this.datePipe.transform(eventData.startTime, 'yyyy-MM-ddTHH:mm');
        this.copyForm.patchValue({
          title: eventData.title,
          description: eventData.description,
          startTime: currStartTime,
          status: eventData.status
        });

        const exercises = this.copyForm.get('exercises') as FormArray;
        exercises.clear();

        eventData.exercises.forEach((exercise: { title: string; quantityApproaches: number; quantityRepetions: number; weight: number }) => {
          exercises.push(this.formBuilder.group({
            title: [exercise.title],
            quantityApproaches: [exercise.quantityApproaches],
            quantityRepetions: [exercise.quantityRepetions],
            weight: [exercise.weight]
          }))
        });
      },
      error: err => {
        this.loadingService.hide();
        this.errorModal.openModal(err);
      }
    });
  }

  //exercise FormArray getter
  get getExercise() {
    return this.copyForm.get('exercises') as FormArray;
  }


  //add additional exercise fields to form
  addField() {
    const formGroup = this.createdItem();
    const exercises = this.copyForm.get('exercises') as FormArray;
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
    const exercises = this.copyForm.get('exercises') as FormArray;
    exercises.removeAt(id);
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
    this.userDataSubscribtion.unsubscribe();
    this.isLoadingDataSubscribtion.unsubscribe();
  }

}
