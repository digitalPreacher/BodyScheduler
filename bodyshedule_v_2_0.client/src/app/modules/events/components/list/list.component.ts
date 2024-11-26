import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { EventService } from '../../shared/event.service';
import { Event } from '../../shared/event.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: ``
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
        console.log(err);
      }
    });

    //get events with completed status
    this.eventService.getEvents(this.completedEventStatus).subscribe({
      next: events => {
        this.completedEvents = events;
        this.collectionCompletedEventsSize = events.length;
      },
      error: err => {
        console.log(err);
      }
    });
  }

}
