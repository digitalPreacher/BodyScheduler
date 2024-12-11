import { Component, OnInit, ViewChild } from '@angular/core';
import { BodyMeasureService } from '../../shared/body-measure.service'
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-line-chart-body-measure',
  templateUrl: './line-chart-body-measure.component.html',
  styles: ``
})
export class LineChartBodyMeasureComponent implements OnInit  {
  bodyMeasureDataChangeSubscribtion: any;
  isLoadingDataSubscribtion: any;
  isLoading!: boolean;


  multi: any[] = []
  view: [number, number] = [1300, 500];

  // options ngx line chart
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Дата';
  yAxisLabel: string = 'Показатели';
  timeline: boolean = true;
  legendTitle: string = 'Тип'

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private bodyMeasureService: BodyMeasureService) {
    this.bodyMeasureService.getBodyMeasuresDataToLineChart().subscribe({
      next: data => {
        this.multi = data;
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    })
  }

  ngOnInit() {
    this.bodyMeasureDataChangeSubscribtion = this.bodyMeasureService.changeData$.subscribe(data => {
      if (data) {
        this.bodyMeasureService.getBodyMeasuresDataToLineChart().subscribe({
          next: data => {
            this.multi = data;
          },
          error: err => {
            this.errorModal.openModal(err);
          }
        })
      }
    })
  }

  //resize ngx line chart by change size window
  onResize(event: any) {
    this.view = [event.target.innerWidth / 1.35, 500];
  }

  ngOnDestroy() {
    this.bodyMeasureDataChangeSubscribtion.unsubscribe();
  }

}
