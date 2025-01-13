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
  maxChartHeight: number = 500;
  maxChartWidth: number = 1300;
  maxWindowSize: number = 1600;


  multi: any[] = []
  view: [number, number] = [window.innerWidth < this.maxWindowSize ? window.innerWidth / 1.20 : this.maxChartWidth, this.maxChartHeight];

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
    this.view = [event.target.innerWidth < this.maxWindowSize ? event.target.innerWidth / 1.20 : this.maxChartWidth, this.maxChartHeight];
  }

  ngOnDestroy() {
    this.bodyMeasureDataChangeSubscribtion.unsubscribe();
  }

}
