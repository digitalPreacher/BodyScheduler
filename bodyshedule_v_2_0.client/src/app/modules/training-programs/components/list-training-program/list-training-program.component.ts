import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TrainingProgramService } from '../../shared/training-program.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';

@Component({
  selector: 'app-list-training-program',
  templateUrl: './list-training-program.component.html',
  styleUrl: 'list-training-program.component.css'
})
export class ListTrainingProgramComponent implements OnInit, OnDestroy {
  programChangeDataSubscribtion: any;
  isLoading!: boolean;
  isLoadingDataSubscribtion: any;

  trainingPrograms: any[] = [];
  collectionSize!: number;
  page = 1;
  pageSize = 10;

  userDataSubscribtion: any;
  userRole = '';

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private authService: AuthorizationService, private trainingProgramsService: TrainingProgramService, private loadingService: LoadingService) {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userRole = data.role;
    });

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
    this.userDataSubscribtion.unsubscribe();
  }

}
