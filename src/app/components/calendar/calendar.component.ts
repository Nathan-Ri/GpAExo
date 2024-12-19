import {Component, OnInit, ViewChild} from '@angular/core';
import {FullCalendarComponent, FullCalendarModule} from '@fullcalendar/angular';
import {CalendarOptions, DateInput, DateSelectArg, EventClickArg, EventInput} from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {AsyncPipe, DatePipe} from '@angular/common';
import {Store} from '@ngrx/store';
import {createEventId} from './event-utils';
import {CalendarFeature} from './reducer';
import * as CalendarActions from './actions';
import {Observable} from 'rxjs';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-calendar',
  imports: [
    FullCalendarModule,
    Button,
    Dialog,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    DatePicker,
    Select
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  protected formGroup: FormGroup;
  protected events$: Observable<any>;
  dialogVisible: boolean = false;
  @ViewChild('calendar') calendarComponent?: FullCalendarComponent;
  projects: string[] | undefined;
  agents: string[] | undefined;

  calendarOptions: CalendarOptions = {
    initialView: 'multiMonthYear',
    plugins: [
      multiMonthPlugin,
      interactionPlugin,
      listPlugin,
    ],
    selectable: true,
    multiMonthMinWidth: 100,
    multiMonthMaxColumns: 1,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };


  constructor(private readonly store: Store) {
    this.events$ = this.store.select(CalendarFeature.selectEvents)
    this.formGroup = new FormGroup({
      id: new FormControl<number | null>(null),
      selectedAgent: new FormControl<String | null>(null, [Validators.required]),
      selectedProject: new FormControl<String | null>(null, [Validators.required]),
      dateStart: new FormControl<Date | null>(null, [Validators.required]),
      dateEnd: new FormControl<Date | null>(null, [Validators.required]),
    });
    this.formGroup.setValue({
      id: null,
      selectedAgent: null,
      selectedProject: null,
      dateStart: new Date(),
      dateEnd: new Date()
    })
  }

  ngOnInit() {
    this.projects = [
      'Super Secret Project1',
      'Super Secret Project2',
      'Super Secret Project3',
      'vacances',
    ]
    this.agents = [
      'Super Secret Agent 1',
      'Super Secret Agent 2',
      'Super Secret Agent 3',
    ]
  }

  handleEventClick(selectInfo: EventClickArg) {
    this.dialogVisible = true
    this.formGroup.setValue({
      id: selectInfo.event.id,
      selectedAgent: selectInfo.event.extendedProps['agent'],
      selectedProject: selectInfo.event.extendedProps['project'],
      dateStart: selectInfo.event.start,
      dateEnd: selectInfo.event.end
    })
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    this.dialogVisible = true
    calendarApi.unselect(); // clear date selection
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
    this.formGroup.setValue({
      id: null,
      selectedAgent: null,
      selectedProject: null,
      dateStart: formattedStart,
      dateEnd: formattedEnd
    })
  }

  saveEvent() {
    if (this.formGroup.valid) {
      let formatedData = this.formGroup.value
      const event: EventInput = {
        id: this.formGroup.get('id')?.value ?? createEventId(),
        title: formatedData.selectedAgent,
        start: this.convertToISOString(formatedData.dateStart),
        end: this.convertToISOString(formatedData.dateEnd),
        allDay: true,
        backgroundColor: this.getColor(formatedData.selectedProject),
        agent: formatedData.selectedAgent,
        project: formatedData.selectedProject
      };
      this.store.dispatch(CalendarActions.createEvent({event})); // create event modify the id of the event thus updating it, if it already exists
      this.dialogVisible = false
    }
  }

  private eventInit(): EventInput {
    return {
      id: createEventId(),
      title: '',
      start: 'selectInfo.startStr',
      end: 'selectInfo.endStr',
      allDay: true
    };
  }

  private getColor(selectedProject: string): string {
    switch (selectedProject) {
      case 'Super Secret Project1':
        return '#f00000'
      case 'Super Secret Project2':
        return '#f000f0'
      case 'Super Secret Project3':
        return '#00f000'
      case 'vacances':
        return '#55555555'
      default:
        return '#55555555'
    }
  }

  convertToISOString(dateStr: string): string {
    if (this.isISOString(dateStr)) return dateStr;
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toISOString();
  }

  isISOString(dateStr: string): boolean {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/;
    return isoRegex.test(dateStr) && !isNaN(Date.parse(dateStr));
  }
}
