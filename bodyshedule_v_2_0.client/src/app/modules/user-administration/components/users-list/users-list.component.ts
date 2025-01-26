import { Component, ViewChild, OnInit } from '@angular/core';
import { UserAdministrationService } from '../../shared/service/user-administration.service'
import { LoadingService } from '../../../shared/service/loading.service';
import { UserAdministrationData } from '../../shared/interfaces/user-administration-data.interface';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  changeDataSubscribtion: any;
  isLoadingDataSubscribtion: any;
  userList!: UserAdministrationData[];
  usersPage = 1;
  pageSize = 5;
  collectionUsersSize!: number;
  isLoading: boolean = false;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private userAdministrationService: UserAdministrationService, private loadingService: LoadingService) {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);
  }

  ngOnInit() {
    this.loadData();
    this.changeDataSubscribtion = this.userAdministrationService.userChangeData$.subscribe(data => {
      if (data) {
        this.loadData();
      }
    })
  }

  //get list of users for administration
  loadData() {
    this.loadingService.show();
    this.userAdministrationService.getUsers().subscribe({
      next: result => {
        this.loadingService.hide();
        this.userList = result;
        this.collectionUsersSize = result.length;
      },
      error: err => {
        this.errorModal.openModal(err);
        this.loadingService.hide();
      }
    })
  }

  ngOnDestroy() {
    this.isLoadingDataSubscribtion.unsubscribe();
    this.changeDataSubscribtion.unsubscribe();
  }
}
