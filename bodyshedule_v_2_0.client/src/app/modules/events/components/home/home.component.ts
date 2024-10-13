import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

import { UserInactivityService } from '../../../authorization/shared/user-inactivity.service';
import { AuthorizationService } from '../../../authorization/shared/authorization.service';
import { EventService } from '../../shared/event.service';
import { pipe } from 'rxjs';
import { Event } from '../../shared/event.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {

  events: any;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    headerToolbar: {
      left: 'prev,next,today',
      center: 'title',
      right: ''
    },
    eventColor: '#6343ac',
    locale: "ru",
    initialView: 'dayGridMonth',
    weekends: true,
  };

  constructor(private authService: AuthorizationService, private inactivityService: UserInactivityService,
    private eventService: EventService) {
  }

  ngOnInit() {
    this.loadData();
    this.eventService.eventChangeData$.subscribe(data => {
      if (data) {
        this.loadData();
      }
    })
  }

  loadData() {
    this.eventService.getEvents().subscribe({
      next: events => {
        this.events = events;
        console.log(events);
        this.calendarOptions = {
          events: this.events
        };
      },
      error: err => {
        console.log(err);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
