import {Component, ViewChild} from '@angular/core';
import {FullCalendarComponent, FullCalendarModule} from '@fullcalendar/angular';
import {CalendarOptions, DateSelectArg, EventClickArg, EventInput} from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import {AsyncPipe} from '@angular/common';
import {Store} from '@ngrx/store';
import {CalendarFeature} from '../reducers/calendar.reducer';
import {Observable} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EventFormComponent} from './form/calendar-event-form/event-form.component';
import * as CalendarActions from '../actions/calendar.action';
import {formatDateIntl} from '../../utils/date.utils';

@Component({
  selector: 'app-calendar',
  imports: [
    FullCalendarModule, // module full calendar (librairie utilisée pour le calendrier)
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    EventFormComponent
  ],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent {
  @ViewChild('calendar') calendarComponent?: FullCalendarComponent;
  eventData?: EventInput;
  events$: Observable<any>;
  dialogVisible: boolean = false;

  calendarOptions: CalendarOptions = {
    initialView: 'multiMonthYear',
    plugins: [
      multiMonthPlugin,
      interactionPlugin,
      listPlugin,
    ],
    selectable: true,
    firstDay: 1,
    timeZone: 'local',
    multiMonthMinWidth: 100,
    multiMonthMaxColumns: 1,
    select: this.handleDateSelect.bind(this), // selection des dates (click direct sur calendrier)
    eventClick: this.handleEventClick.bind(this), // click sur un event pour modification
  };

  constructor(private readonly store: Store) {
    this.events$ = store.select(CalendarFeature.selectEvents) // bind du flux sur le store fullCalendar
  }

  handleEventClick(selectInfo: EventClickArg): void {
    this.dialogVisible = true
    this.store.dispatch(CalendarActions.formEvent({
          id: selectInfo.event.id,
      selectedAgent: selectInfo.event.extendedProps['agent'],
      selectedProject: selectInfo.event.extendedProps['project'],
      dateStart: formatDateIntl(selectInfo.event.startStr),
      dateEnd: formatDateIntl(selectInfo.event.endStr)
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg): void {
    const calendarApi = selectInfo.view.calendar;
    this.dialogVisible = true
    calendarApi.unselect(); // clear date selection
    //formate les dates de la bibliothèque de composant pour correspondre à la lisibilité française
    const dateStart = new Date(selectInfo.startStr)
    const formattedStart = dateStart.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const dateEnd = new Date(selectInfo.endStr)
    const formattedEnd = dateEnd.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    this.store.dispatch(CalendarActions.formEvent({
       id: null,
      selectedAgent: null,
      selectedProject: null,
      dateStart: formattedStart,
      dateEnd: formattedEnd
    }));
  }

}
