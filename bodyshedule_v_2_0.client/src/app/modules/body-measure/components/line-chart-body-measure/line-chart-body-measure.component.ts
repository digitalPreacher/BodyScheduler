import { Component, OnInit } from '@angular/core';
import { BodyMeasureService } from '../../shared/body-measure.service'

@Component({
  selector: 'app-line-chart-body-measure',
  templateUrl: './line-chart-body-measure.component.html',
  styles: ``
})
export class LineChartBodyMeasureComponent implements OnInit  {
  multi: any[] = []

  view: [number, number] = [1300, 500];

  // options
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

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

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

}
