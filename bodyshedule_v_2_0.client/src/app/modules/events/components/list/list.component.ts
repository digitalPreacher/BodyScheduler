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
  events: Event[] = [];

  constructor(private authService: AuthorizationService, private eventService: EventService) { }

  ngOnInit() {
    this.loadData();
    this.eventService.eventAdded$.subscribe(data => {
      if (data) {
        this.loadData();
      }
    })
  }

  loadData() {
    this.eventService.getEvents().subscribe({
      next: events => {
        this.events = events;
        console.log(this.events);
      },
      error: err => {
        console.log(err);
      }
    });
  }

}
