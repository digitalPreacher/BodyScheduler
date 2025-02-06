import { Component, ViewChild } from '@angular/core';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { TrainingResultService } from '../../shared/training-result.service'
import { TrainingResult } from '../../shared/interfaces/training-result.interface';
import { LoadingService } from '../../../shared/service/loading.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';


@Component({
  selector: 'app-training-results-list',
  templateUrl: './training-results-list.component.html',
  styleUrl: './training-results-list.component.css'
})
export class TrainingResultsListComponent {
  userDataSubscribtion: any;
  userId: string = '';
  trainingResults!: TrainingResult[];
  collectionSize: number = 0;
  pageSize = 10;
  page = 1;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private authService: AuthorizationService, private trainingResultService: TrainingResultService, private loadingService: LoadingService) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    })
  }

  ngOnInit() {
    this.getTrainingResults();
  }

  getTrainingResults() {
    this.loadingService.show();
    this.trainingResultService.getTrainingResults(this.userId).subscribe({
      next: data => {
        this.loadingService.hide();
        this.trainingResults = data
        this.collectionSize = data.length;
      },
      error: err => {
        this.errorModal.openModal(err);
        this.loadingService.hide();
      }
    })
  }




}
