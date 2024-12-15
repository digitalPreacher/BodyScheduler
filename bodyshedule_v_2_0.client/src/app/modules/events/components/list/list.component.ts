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
  collectionProgressEventsSize!: number;
  collectionCompletedEventsSize!: number;
  progressEventsPage = 1;
  completedEventsPage = 1;
  pageSize = 5;
  inProgressEventStatus: string = 'inProgress';
  completedEventStatus: string = 'completed';
  isLoading: boolean = true;

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private authService: AuthorizationService, private eventService: EventService, private loadingService: LoadingService) {
    this.isLoadingDataSubscribtion = this.loadingService.loading$.subscribe(loading => this.isLoading = loading);
  }

  ngOnInit() { 
    this.loadData();
    this.changeDataSubscribtion = this.eventService.eventChangeData$.subscribe(data => {
      if (data) {
        this.loadData();
      }
    })
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
