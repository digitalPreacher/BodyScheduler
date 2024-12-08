import { Component, OnInit, ViewChild } from '@angular/core';
import { TrainingProgramService } from '../../shared/training-program.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-list-training-program',
  templateUrl: './list-training-program.component.html',
  styles: ``
})
export class ListTrainingProgramComponent implements OnInit {
  trainingPrograms: any[] = [];
  collectionSize!: number;
  page = 1;
  pageSize = 10;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

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
        this.collectionSize = result.length;
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    });
  }

}
