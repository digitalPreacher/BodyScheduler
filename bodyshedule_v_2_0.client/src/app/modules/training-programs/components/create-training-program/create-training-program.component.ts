import { Component, Output, inject, TemplateRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { TrainingProgramService } from '../../shared/training-program.service'


@Component({
  selector: 'app-create-training-program',
  templateUrl: './create-training-program.component.html',
  styles: ``,
  providers: [DatePipe]
})
export class CreateTrainingProgramComponent {
  modalService = inject(NgbModal);
  userDataSubscribtion: any;
  userId: string = '';
  createForm: FormGroup;

  constructor(private programService: TrainingProgramService, private formBuilder: FormBuilder,
    private authService: AuthorizationService, private datePipe: DatePipe)
  {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    });

    this.createForm = this.formBuilder.group({
      userId: [this.userId, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      weeks: this.formBuilder.array([])
    })

    this.createForm.get
  }

  addWeeks(): FormGroup {
    return this.formBuilder.group({
      weekNumber: [0, Validators.required],
      events: this.formBuilder.array([])
    })
  }

  addEvents(): FormGroup {
    return this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startTime: ['', Validators.required],
      exercises: this.formBuilder.array([])
    })
  }

  addExercises(): FormGroup{
    return this.formBuilder.group({
      title: ['', Validators.required],
      quantityApproaches: [0, Validators.required],
      quantityRepetions: [0, Validators.required],
      weight: [0, Validators.required]
    })
  }

}
