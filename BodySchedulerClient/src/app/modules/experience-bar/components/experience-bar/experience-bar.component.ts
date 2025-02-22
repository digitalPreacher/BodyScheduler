import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ExperienceBarService } from '../../shared/experience-bar.service';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { ExperienceData } from '../../shared/models/experience-data';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-experience-bar',
  templateUrl: './experience-bar.component.html',
  styleUrl: './experience-bar.component.css'
})
export class ExperienceBarComponent implements OnInit, OnDestroy {
  userDataSubscribtion: any;
  userExperienceChangeDataSubscribtion: any;
  userId: string = '';
  experienceData: ExperienceData = new ExperienceData();
  userLevel: number = 0;
  experienceProgress: number = 0;
  progressStyle = {
    width: '0%'
  }

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;


  constructor(private expService: ExperienceBarService, private authService: AuthorizationService) {
    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userId = data.userId;
    })
  }

  ngOnInit() {
    this.getUserExperience();

    this.userExperienceChangeDataSubscribtion = this.expService.userExperienceChangeData$.subscribe(data => {
      if (data) {
        this.getUserExperience();
      }
    })
  }

  //get user experience data from api
  getUserExperience() {
    this.expService.getUserExperience(this.userId).subscribe({
      next: data => {
        if (typeof data === 'object') {
          this.experienceData = data;
          this.calculateExperience(this.experienceData);
        }
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    });
  }

  //calculate user lvl and pecentage of progress
  calculateExperience(expData: ExperienceData) {
    this.experienceProgress = Math.round((expData.currentExperienceValue / expData.goalExperienceValue) * 100);
    this.progressStyle = {
      width: `${this.experienceProgress}` + '%'
    }
    this.userLevel = expData.goalExperienceValue / 100
  }

  ngOnDestroy() {
    this.userDataSubscribtion.unsubscribe();
    this.userExperienceChangeDataSubscribtion.unsubscribe();
  }

}
