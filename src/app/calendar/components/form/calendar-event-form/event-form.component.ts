import {Component, Input, OnDestroy, output} from '@angular/core';
import {Store} from '@ngrx/store';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {DatePicker} from 'primeng/datepicker';
import {Select} from 'primeng/select';
import {EventInput} from '@fullcalendar/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {AgentFeature} from '../../../../agent/reducers/agent.reducer';
import {ProjectFeature} from '../../../../project/reducers/project.reducer';
import {CalendarFeature} from '../../../reducers/calendar.reducer';
import {createEventId, getColor} from '../../../../utils/event.utils';
import {convertToISOString} from '../../../../utils/date.utils';
import * as CalendarActions from '../../../actions/calendar.action';


@Component({
  selector: 'app-event-form',
  imports: [
    AsyncPipe,
    DatePicker,
    Select,
    ReactiveFormsModule,
    Button,
    Dialog,
  ],
  templateUrl: './event-form.component.html',
})
export class EventFormComponent implements OnDestroy {
  @Input() eventData?: EventInput;
  @Input() dialogVisible!: boolean;
  dialogVisibleChange = output<void>()
  formGroup: FormGroup;
  agents$: Observable<any>;
  projects$: Observable<any>;
  formEvent$: Observable<any>;
  private subscription: Subscription = new Subscription();

  constructor(private readonly store: Store) {
    this.agents$ = store.select(AgentFeature.selectAgents) // bind du flux sur le store fullCalendar
    this.projects$ = store.select(ProjectFeature.selectProjects) // bind du flux sur le store fullCalendar
    this.formGroup = new FormGroup({
      id: new FormControl<number | null>(null),
      selectedAgent: new FormControl<String | null>(null, [Validators.required]),
      selectedProject: new FormControl<String | null>(null, [Validators.required]),
      dateStart: new FormControl<String | null>(null, [Validators.required]),
      dateEnd: new FormControl<String | null>(null, [Validators.required]),
    });
    this.formEvent$ = store.select(CalendarFeature.selectFormEvent)
    this.subscription.add(
      this.formEvent$.subscribe((formEvent) => {
        if (formEvent) {
          this.formGroup.setValue(formEvent);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  saveEvent() {
    if (this.formGroup.valid) {
      let formatedData = this.formGroup.value
      const event: EventInput = {
        id: this.formGroup.get('id')?.value ?? createEventId(), // crée un id ou en utilise un présent
        title: formatedData.selectedAgent,
        start: convertToISOString(formatedData.dateStart),
        end: convertToISOString(formatedData.dateEnd),
        allDay: true,
        backgroundColor: getColor(formatedData.selectedProject),
        agent: formatedData.selectedAgent,
        project: formatedData.selectedProject
      };
      // Dispatch de l'action pour sauvegarder ou modifier l'événement.
      this.store.dispatch(CalendarActions.createEvent({event}));
      this.closeDialog()
    }
  }

  closeDialog() {
    this.dialogVisibleChange.emit()
  }
}
