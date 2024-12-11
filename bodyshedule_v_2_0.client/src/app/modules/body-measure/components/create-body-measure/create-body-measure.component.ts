import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { BodyMeasureService } from '../../shared/body-measure.service'
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service';


@Component({
  selector: 'app-create-body-measure',
  templateUrl: './create-body-measure.component.html',
  styles: ``
})
export class CreateBodyMeasureComponent implements OnInit, OnDestroy {
  isLoadingDataSubscribtion: any;
  userDataSubscribtion: any;
  userId: string = '';
  createForm: FormGroup;
  isLoading!: boolean;

  uniqueLastBodyMeasureArray: any[] = [];


  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private bodyMeasureService: BodyMeasureService, private formBuilder: FormBuilder, private authService: AuthorizationService,
    private loadingService: LoadingService) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    });

    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

    this.createForm = this.formBuilder.group({
      userId: [this.userId, Validators.required],
      bodyMeasureSet: this.formBuilder.array([this.formBuilder.group({
        muscleName: ['Запястье'],
        musclesSize: [0]
      }),
      this.formBuilder.group({
        muscleName: ['Предплечье'],
        musclesSize: [0]
      }),
      this.formBuilder.group({
        muscleName: ['Бицепс'],
        musclesSize: [0]
      }),
      this.formBuilder.group({
        muscleName: ['Живот'],
        musclesSize: [0]
      }),
      this.formBuilder.group({
        muscleName: ['Бедро'],
        musclesSize: [0]
      }),
      this.formBuilder.group({
        muscleName: ['Голень'],
        musclesSize: [0]
      }),
      this.formBuilder.group({
        muscleName: ['Лодыжка'],
        musclesSize: [0]
      }),
      this.formBuilder.group({
        muscleName: ['Шея'],
        musclesSize: [0]
      }),
      this.formBuilder.group({
        muscleName: ['Плечевой пояс'],
        musclesSize: [0]
      }),
      this.formBuilder.group({
        muscleName: ['Грудь'],
        musclesSize: [0]
      }),
      this.formBuilder.group({
        muscleName: ['Таз'],
        musclesSize: [0]
      }),
      this.formBuilder.group({
        muscleName: ['Вес'],
        musclesSize: [0]
      })])
    });
  }

  ngOnInit() {
    this.getUniqueBodyMeasure();
  }

  //adding new entry of body measure
  addBodyMeasure() {
    this.loadingService.show();
    this.bodyMeasureService.addBodyMeasure(this.createForm.value).subscribe({
      next: result => {
        this.loadingService.hide();
        this.bodyMeasureService.changeData$.next(true);
      },
      error: err => {
        this.loadingService.hide();
        this.errorModal.openModal(err);
      }
    })
  }

  //getting array of bodyMeasureSet from create form
  get bodyMeasureArray() {
    return this.createForm.get('bodyMeasureSet') as FormArray;
  }

  //getting last added entry with unique muscleName
  getUniqueBodyMeasure() {
    this.loadingService.show();
    this.bodyMeasureService.getUniqueBodyMeasure().subscribe({
      next: result => {
        this.loadingService.hide();
        result.forEach((getBodyMeasure: { muscleName: string, musclesSize: number }) => {
          this.bodyMeasureArray.controls.forEach((currentbodyMeasure) => {
            if (getBodyMeasure.muscleName === currentbodyMeasure.get('muscleName')?.value) {
              currentbodyMeasure.get('musclesSize')?.setValue(getBodyMeasure.musclesSize);
            }
          });
        });
      },
      error: err => {
        this.loadingService.hide();
        this.errorModal.openModal(err);
      }
    })
  }

  ngOnDestroy() {
    this.isLoadingDataSubscribtion.unsubscribe();
    this.userDataSubscribtion.unsubscribe()
  }
}
