import { Component, Output, inject, TemplateRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Event } from '../../shared/event.model';
import { EventService } from '../../shared/event.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from "@angular/common";

import { AuthorizationService } from '../../../authorization/shared/authorization.service';

import moment, { utc } from 'moment';
import { DatePipe } from '@angular/common';
import { ex } from '@fullcalendar/core/internal-common';
import { startWith } from 'rxjs';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service';
import { ExerciseTitleSearch } from '../../../shared/classes/exercise-title-search';
import { CustomExerciseTitleData } from '../../../shared/models/custom-exercise-title-data.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  providers: [DatePipe]
})
export class CreateComponent extends ExerciseTitleSearch implements OnInit, OnDestroy {
  isLoadingDataSubscribtion: any;
  userDataSubscribtion: any;
  createForm: FormGroup;
  modalService = inject(NgbModal);
  userId: string = '';
  isLoading!: boolean;
  customExerciseTitleData!: CustomExerciseTitleData[];

/*  override listValue: string[] = []*/;
  submittedClick = false;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private eventService: EventService, private formBuilder: FormBuilder,
    private authService: AuthorizationService, private datePipe: DatePipe, private loadingService: LoadingService)
  {
    super(eventService);

    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    });

    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

    this.createForm = this.formBuilder.group({
      userId: [this.userId, Validators.required],
      title: ['', Validators.required],
      description: [''],
      startTime: ['', Validators.required],
      exercises: this.formBuilder.array([this.createdItem()])
    });
  }

  //send data to backend 
  create() {
    if (this.createForm.valid) {
      this.loadingService.show();
      const currStartTime = this.datePipe.transform(this.createForm.get('startTime')?.value, 'yyyy-MM-ddTHH:mm:ss.ssS', 'UTC') + 'Z';
      this.createForm.patchValue({
        startTime: currStartTime,
      });
      this.eventService.addEvent(this.createForm.value).subscribe({
        next: result => {
          this.loadingService.hide();
          this.modalService.dismissAll();
          this.eventService.eventChangeData$.next(true);
          this.resetForm();
        },
        error: err => {
          this.loadingService.hide();
          this.errorModal.openModal(err);
        }
      });
    }
  }

  //add additional exercise fields to form
  createdItem(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      quantityApproaches: [0, Validators.required],
      quantityRepetions: [0, Validators.required],
      weight: [0, Validators.required]
    })
  }

  //exercises getter 
  get fields() {
    return this.createForm.get('exercises') as FormArray;
  }

  //adding additional fields of exercises to events form
  addField() {
    const formGroup = this.createdItem();
    const exercises = this.createForm.get('exercises') as FormArray;
    exercises.push(formGroup);
  }

  //remove additional fields of exercises to events form
  removeField(id: number) {
    const exercises = this.createForm.get('exercises') as FormArray;
    exercises.removeAt(id);
    console.log("remove item with id: " + id);
  }

  //return default form fields
  setDefaultCreateForm() {
    return this.formBuilder.group({
      userId: [this.userId, Validators.required],
      title: ['', Validators.required],
      description: [''],
      startTime: ['', Validators.required],
      exercises: this.formBuilder.array([this.createdItem()])
    })
  }

  //reset reactive form
  resetForm() {
    const defaultCreateForm = this.setDefaultCreateForm();
    this.submittedClick = false;
    this.createForm = defaultCreateForm;
  }

  //open modal form
  open(content: TemplateRef<any>) {
    const options: NgbModalOptions = {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title'
    };

    this.modalService.open(content, options);
  }

  ngOnDestroy() {
    this.userDataSubscribtion.unsubscribe();
    this.isLoadingDataSubscribtion.unsubscribe();
    this.exerciseTitleDataSubscribe.unsubscribe();
  }
}
