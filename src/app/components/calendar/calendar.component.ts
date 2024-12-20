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
    FullCalendarModule, // module full calendar (librairie utilisée pour le calendrier)
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
  formGroup: FormGroup;
  events$: Observable<any>; // flux d'évènement du calendrier récupérer via NgRx
  dialogVisible: boolean = false;
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
    firstDay: 1,
    multiMonthMinWidth: 100,
    multiMonthMaxColumns: 1,
    select: this.handleDateSelect.bind(this), // selection des dates (click direct sur calendrier)
    eventClick: this.handleEventClick.bind(this), // click sur un event pour modification
  };


  constructor(private readonly store: Store) {
    this.events$ = this.store.select(CalendarFeature.selectEvents) // bind du flux sur le store fullCalendar
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
    //mise en dur des projets et agents, j'ai simplifier l'exo pour utiliser moins de models
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
    console.log('api', calendarApi, selectInfo)
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
  saveEvent() {
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
    // une fois convertie en isostring, le type de dateStr est object.
    // Donc pas String, mais typescript laisse le parametre string car object est casté en string.
    // Cela permet l'update en gardant les données des inputs.
    // C'est un peu étrange mais ça permet d'avoir la date en lecture française et pas américaine.
    if (typeof dateStr !== "string") return dateStr;
    const [day, month, year] = dateStr.split('/').map(Number);
    // const date = new Date(year, month - 1, day);
    let date = new Date(Date.UTC(year, month - 1, day)); // Crée une date en UTC
    return date.toISOString();
  }

}
