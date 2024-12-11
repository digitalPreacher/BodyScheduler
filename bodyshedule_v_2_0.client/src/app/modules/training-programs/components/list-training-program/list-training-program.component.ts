import { Component, OnInit, ViewChild } from '@angular/core';
import { TrainingProgramService } from '../../shared/training-program.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service';

@Component({
  selector: 'app-list-training-program',
  templateUrl: './list-training-program.component.html',
  styles: ``
})
export class ListTrainingProgramComponent implements OnInit {
  programChangeDataSubscribtion: any;
  isLoading!: boolean;
  isLoadingDataSubscribtion: any;

  trainingPrograms: any[] = [];
  collectionSize!: number;
  page = 1;
  pageSize = 10;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private trainingProgramsService: TrainingProgramService, private loadingService: LoadingService) {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);
  }

  ngOnInit() {
    this.loadData();
    this.programChangeDataSubscribtion = this.trainingProgramsService.programChangeData$.subscribe(data => {
      if (data) {
        this.loadData();
      }
    });
  }

  //getting data of training program
  loadData() {
    this.loadingService.show();
    this.trainingProgramsService.getTrainingPrograms().subscribe({
      next: result => {
        this.loadingService.hide();
        this.trainingPrograms = result;
        this.collectionSize = result.length;
      },
      error: err => {
        this.loadingService.hide();
        this.errorModal.openModal(err);
      }
    });
  }

  ngOnDestroy() {
    this.programChangeDataSubscribtion.unsubscribe();
    this.isLoadingDataSubscribtion.unsubscribe();
  }

}
