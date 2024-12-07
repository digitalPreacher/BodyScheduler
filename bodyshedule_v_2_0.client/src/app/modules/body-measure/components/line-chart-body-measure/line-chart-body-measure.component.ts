import { Component, OnInit } from '@angular/core';
import { BodyMeasureService } from '../../shared/body-measure.service'
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-line-chart-body-measure',
  templateUrl: './line-chart-body-measure.component.html',
  styles: ``
})
export class LineChartBodyMeasureComponent implements OnInit  {
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


  constructor(private bodyMeasureService: BodyMeasureService) {
    this.bodyMeasureService.getBodyMeasuresDataToLineChart().subscribe(data => {
      this.multi = data;
    })
  }

  ngOnInit() {
    this.bodyMeasureService.changeData$.subscribe(data => {
      if (data) {
        this.bodyMeasureService.getBodyMeasuresDataToLineChart().subscribe(data => {
          this.multi = data;
        })
      }
    })
  }

  //resize ngx line chart by change size window
  onResize(event: any) {
    this.view = [event.target.innerWidth / 1.35, 500];
  }

}
