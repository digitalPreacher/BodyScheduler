import { Component, OnInit } from '@angular/core';
import { TrainingProgramService } from '../../shared/training-program.service';

@Component({
  selector: 'app-list-training-program',
  templateUrl: './list-training-program.component.html',
  styles: ``
})
export class ListTrainingProgramComponent implements OnInit {
  trainingPrograms: any[] = [];

  constructor(private trainingProgramsService: TrainingProgramService) { }

  ngOnInit() {
    this.loadData();
    this.trainingProgramsService.programChangeData$.subscribe(data => {
      if (data) {
        this.loadData();
      }
    });
  }

  //getting data of training program
  loadData() { 
    this.trainingProgramsService.getTrainingPrograms().subscribe({
      next: result => {
        this.trainingPrograms = result;
      }
    });
  }

}
