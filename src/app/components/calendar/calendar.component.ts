import {Component, OnInit, ViewChild} from '@angular/core';
import {FullCalendarComponent, FullCalendarModule} from '@fullcalendar/angular';
import {CalendarOptions, DateSelectArg, EventInput} from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import {Avatar} from 'primeng/avatar';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {AsyncPipe} from '@angular/common';
import {Store, StoreModule} from '@ngrx/store';
import {createEventId} from './event-utils';
import {CalendarFeature, selectEventsCount} from './reducer';
import * as CalendarActions from './actions';
import {map, Observable} from 'rxjs';

@Component({
  selector: 'app-calendar',
  imports: [
    FullCalendarModule,
    Avatar,
    Button,
    Dialog,
    AsyncPipe,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  dialogVisible: boolean = false;
  @ViewChild('calendar') calendarComponent?: FullCalendarComponent;
  eventsPromise?: Promise<EventInput[]>;

  calendarOptions: CalendarOptions = {
    initialView: 'multiMonthYear',
    plugins: [
      multiMonthPlugin,
      interactionPlugin,
      listPlugin,
    ],
    selectable: true,
    multiMonthMinWidth: 100,
    multiMonthMaxColumns: 2,
    dateClick: this.handleDateClick.bind(this),
    select: this.handleDateSelect.bind(this),
  };
  protected events$: Observable<any>;

  constructor(private readonly store: Store) {
    this.events$ = this.store.select(CalendarFeature.selectEvents)
  }

  ngOnInit() {
    // this.events$ = this.store.select(CalendarFeature.selectEvents).pipe(
    //   map(events => events.map(event => ({
    //     id: event.id,
    //     title: event.title,
    //     start: event.start,
    //     end: event.end,
    //     allDay: event.allDay
    //   })))
    // );
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    console.log('ezae', selectInfo)
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      const event: EventInput = {
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      };
      this.store.dispatch(CalendarActions.createEvent({event}));
    }
  }

  // handleEventClick(clickInfo: EventClickArg) {
  //   console.log('aze')
  //   if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
  //     this.store.dispatch(CalendarActions.deleteEvent({id: clickInfo.event.id}));
  //   }
  // }

  private handleDateClick(arg: any): void {
    // console.log('a', this.store.select(this.dialogVisible))
    if (!this.calendarComponent) return
    let calendarApi = this.calendarComponent.getApi();
    this.calendarOptions.events
    // this.dialogVisible = true

    this.store.dispatch(CalendarActions.dateClick());
  }

}
