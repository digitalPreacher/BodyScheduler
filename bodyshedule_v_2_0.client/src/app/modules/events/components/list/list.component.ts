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
  events: any[] = [];
  collectionSize!: number;
  page = 1;
  pageSize = 10;

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
    this.eventService.getEvents().subscribe({
      next: events => {
        this.events = events;
        this.collectionSize = events.length;
      },
      error: err => {
        console.log(err);
      }
    });
  }

}
