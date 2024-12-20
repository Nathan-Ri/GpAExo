import {Component, OnInit, ViewChild} from '@angular/core';
import {FullCalendarComponent, FullCalendarModule} from '@fullcalendar/angular';
import {CalendarOptions, DateSelectArg, EventClickArg, EventInput} from '@fullcalendar/core';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {AsyncPipe} from '@angular/common';
import {Store} from '@ngrx/store';
import {CalendarFeature} from './reducer';
import * as CalendarActions from './actions';
import {Observable} from 'rxjs';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';
import {Select} from 'primeng/select';
import {Tooltip} from 'primeng/tooltip';
import {AgentFeature} from '../../stores/agents/agent.reducer';
import {ProjectFeature} from '../../stores/projects/project.reducer';
import {createEventId} from './event-utils';

@Component({
  selector: 'app-calendar',
  imports: [
    FullCalendarModule, // module full calendar (librairie utilisée pour le calendrier)
    Button,
    Dialog,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    DatePicker,
    Select,
    Tooltip
  ],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent {
  @ViewChild('calendar') calendarComponent?: FullCalendarComponent;
  formGroup: FormGroup;
  events$: Observable<any>; // flux d'évènement du calendrier récupérer via NgRx
  agents$: Observable<any>;
  projects$: Observable<any>;
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
    this.agents$ = store.select(AgentFeature.selectAgents) // bind du flux sur le store fullCalendar
    this.projects$ = store.select(ProjectFeature.selectProjects) // bind du flux sur le store fullCalendar
    this.formGroup = new FormGroup({
      id: new FormControl<number | null>(null),
      selectedAgent: new FormControl<String | null>(null, [Validators.required]),
      selectedProject: new FormControl<String | null>(null, [Validators.required]),
      dateStart: new FormControl<String | null>(null, [Validators.required]),
      dateEnd: new FormControl<String | null>(null, [Validators.required]),
    });
    this.formGroup.setValue({
      id: null,
      selectedAgent: null,
      selectedProject: null,
      dateStart: null,
      dateEnd: null
    })
  }

  handleEventClick(selectInfo: EventClickArg): void {
    this.dialogVisible = true
    this.formGroup.setValue({
      id: selectInfo.event.id,
      selectedAgent: selectInfo.event.extendedProps['agent'],
      selectedProject: selectInfo.event.extendedProps['project'],
      dateStart: this.formatDateIntl(selectInfo.event.startStr),
      dateEnd: this.formatDateIntl(selectInfo.event.endStr)
    })
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
    this.formGroup.setValue({
      id: null,
      selectedAgent: null,
      selectedProject: null,
      dateStart: formattedStart,
      dateEnd: formattedEnd
    })
  }

  // Sauvegarde un événement en utilisant les valeurs du formulaire.
  saveEvent(): void {
    if (this.formGroup.valid) {
      let formatedData = this.formGroup.value
      const event: EventInput = {
        id: this.formGroup.get('id')?.value ?? createEventId(), // crée un id ou en utilise un présent
        title: formatedData.selectedAgent,
        start: this.convertToISOString(formatedData.dateStart),
        end: this.convertToISOString(formatedData.dateEnd),
        allDay: true,
        backgroundColor: this.getColor(formatedData.selectedProject),
        agent: formatedData.selectedAgent,
        project: formatedData.selectedProject
      };
      // Dispatch de l'action pour sauvegarder ou modifier l'événement.
      this.store.dispatch(CalendarActions.createEvent({event}));
      this.dialogVisible = false
    }
  }

  // Détermine la couleur de l'événement en fonction du projet sélectionné.
  getColor(selectedProject: string): string {
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

  // Convertit une date au format français (dd/mm/yyyy) en ISOString.
  convertToISOString(dateStr: string): string {
    const [day, month, year] = dateStr.split('/').map(Number);
    let date = new Date(Date.UTC(year, month - 1, day)); // Crée une date en UTC
    return date.toISOString();
  }


  formatDateIntl(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

}
