import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { EventService } from '../../shared/event.service';
import { Event } from '../../shared/event.model';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingService } from '../../../shared/service/loading.service'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit, OnDestroy {
  isLoadingDataSubscribtion: any;
  changeDataSubscribtion: any;
  inProgressEvents: any[] = [];
  completedEvents: any[] = [];
  filteringinProgressEvents: any[] = [];
  filteringCompleteEvents: any[] = [];
  collectionProgressEventsSize!: number;
  collectionCompletedEventsSize!: number;
  collectionFilterProgressEventsSize!: number;
  collectionFilterCompletedEventsSize!: number;
  progressEventsPage = 1;
  completedEventsPage = 1;
  pageSize = 5;
  inProgressEventStatus: string = 'inProgress';
  completedEventStatus: string = 'completed';

  isLoading: boolean = true;

  userDataSubscribtion: any;
  userRole = '';
  isFilter: boolean = false;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private authService: AuthorizationService, private eventService: EventService, private loadingService: LoadingService) {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);

    this.userDataSubscribtion = this.authService.userData$.asObservable().subscribe(data => {
      this.userRole = data.role;
    });

  }

  ngOnInit() { 
    this.loadData();
    this.changeDataSubscribtion = this.eventService.eventChangeData$.subscribe(data => {
      if (data) {
        this.loadData();
      }
    })
  }

  //filtering data by input to search field
  filteringData(keyUp: string) {
    this.isFilter = true;

    //filtering data to events in progress status
    this.filteringinProgressEvents = this.inProgressEvents.filter((value: {title: string, description: string}) =>
      value.title.toLowerCase().includes(keyUp.toLowerCase()) || value.description.toLowerCase().includes(keyUp.toLowerCase()));

    this.collectionFilterProgressEventsSize = this.filteringinProgressEvents.length;

    //filtering data to events in complete status
    this.filteringCompleteEvents = this.completedEvents.filter((value: { title: string, description: string }) =>
      value.title.toLowerCase().includes(keyUp.toLowerCase()) || value.description.toLowerCase().includes(keyUp.toLowerCase()));

    this.collectionFilterCompletedEventsSize = this.filteringCompleteEvents.length;

    if (keyUp === '') {
      this.isFilter = false;
    }
  }

  //getting data of events
  loadData() {
    //get events with inProgress status
    this.loadingService.show();
    this.eventService.getEvents(this.inProgressEventStatus).subscribe({
      next: events => {
        this.inProgressEvents = events;
        this.collectionProgressEventsSize = events.length;
        this.loadingService.hide();
      },
      error: err => {
        this.errorModal.openModal(err);
        this.loadingService.hide();
      }
    });

    //get events with Completed status
    this.eventService.getEvents(this.completedEventStatus).subscribe({
      next: events => {
        this.completedEvents = events;
        this.collectionCompletedEventsSize = events.length;
        this.loadingService.hide();
      },
      error: err => {
        this.errorModal.openModal(err);
        this.loadingService.hide();
      }
    });
  }

  ngOnDestroy() {
    this.isLoadingDataSubscribtion.unsubscribe();
    this.changeDataSubscribtion.unsubscribe();
  }

}
