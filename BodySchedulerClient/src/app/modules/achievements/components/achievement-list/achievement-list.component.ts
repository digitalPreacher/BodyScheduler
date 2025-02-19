import { Component, ViewChild } from '@angular/core';
import { AchievementService } from '../../shared/achievement.service'
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { LoadingService } from '../../../shared/service/loading.service';
import { Achievement } from '../../shared/models/achievement.model';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-achievement-list',
  templateUrl: './achievement-list.component.html',
  styleUrl: './achievement-list.component.css'
})
export class AchievementListComponent {
  isLoading: boolean = false;
  isLoadingDataSubscribtion: any;
  userDataSubscribtion: any;
  userId: string = '';
  achievements!: Achievement[];

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private achievementService: AchievementService, private authService: AuthorizationService, private loadingService: LoadingService)
  {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    });
  }

  ngOnInit() {
    this.getAchievements();
  }

  //lodad data about user achievements
  getAchievements() {
    this.loadingService.show();
    this.achievementService.getAchievements(this.userId).subscribe({
      next: data => {
        this.loadingService.hide();
        if (typeof data === 'object') {
          this.achievements = data;
        }
      },
      error: err => {
        this.loadingService.hide();
        this.errorModal.openModal(err);
      }
    })
  }

  ngOnDestroy() {
    this.isLoadingDataSubscribtion.unsubscribe();
    this.userDataSubscribtion.unsubscribe();
  }

}
