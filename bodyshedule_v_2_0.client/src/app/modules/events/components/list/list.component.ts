import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { EventService } from '../../shared/event.service';
import { Event } from '../../shared/event.model';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit {
  inProgressEvents: any[] = [];
  completedEvents: any[] = [];
  collectionProgressEventsSize!: number;
  collectionCompletedEventsSize!: number;
  progressEventsPage = 1;
  completedEventsPage = 1;
  pageSize = 5;
  inProgressEventStatus: string = 'inProgress';
  completedEventStatus: string = 'completed';

  @ViewChild('errorModal') errorModal!: ErrorModalComponent;

  constructor(private authService: AuthorizationService, private eventService: EventService) { }

  ngOnInit() {
    this.loadData();
    this.eventService.eventChangeData$.subscribe(data => {
      if (data) {
        this.loadData();
      }
    })
  }

  //getting data of events
  loadData() {
    //get events with inProgress status
    this.eventService.getEvents(this.inProgressEventStatus).subscribe({
      next: events => {
        this.inProgressEvents = events;
        this.collectionProgressEventsSize = events.length;
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    });

    //get events with Completed status
    this.eventService.getEvents(this.completedEventStatus).subscribe({
      next: events => {
        this.completedEvents = events;
        this.collectionCompletedEventsSize = events.length;
      },
      error: err => {
        this.errorModal.openModal(err);
      }
    });
  }

}
