import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { BodyMeasureService } from '../../shared/body-measure.service'
import { AuthorizationService } from '../../../authorization/shared/authorization.service';


@Component({
  selector: 'app-create-body-measure',
  templateUrl: './create-body-measure.component.html',
  styles: ``
})
export class CreateBodyMeasureComponent implements OnInit {
  userDataSubscribtion: any;
  userId: string = '';
  uniqueLastBodyMeasureArray: any[] = [];

  createForm: FormGroup;

  constructor(private bodyMeasureService: BodyMeasureService, private formBuilder: FormBuilder, private authService: AuthorizationService) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    });
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
    this.bodyMeasureService.addBodyMeasure(this.createForm.value).subscribe({
      next: result => {
        console.log(result);
      },
      error: err => {
        console.log(err);
      }
    })
  }

  //getting array of bodyMeasureSet from create form
  get bodyMeasureArray() {
    return this.createForm.get('bodyMeasureSet') as FormArray;
  }

  //getting last added entry with unique muscleName
  getUniqueBodyMeasure() {
    this.bodyMeasureService.getUniqueBodyMeasure().subscribe({
      next: result => {
        result.forEach((getBodyMeasure: { muscleName: string, musclesSize: number }) => {
          this.bodyMeasureArray.controls.forEach((currentbodyMeasure) => {
            if (getBodyMeasure.muscleName === currentbodyMeasure.get('muscleName')?.value) {
              currentbodyMeasure.get('musclesSize')?.setValue(getBodyMeasure.musclesSize);
            }
          });
        });

        this.bodyMeasureService.changeData$.next(true);
      },
      error: err => {
        console.log(err);
      }
    })
  }

}
