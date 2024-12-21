import {EventInput} from '@fullcalendar/core';
import {createFeature, createReducer, on} from '@ngrx/store';
import * as CalendarActions from '../actions/calendar.action';

interface State {
  formEvent: {
    id: string | null,
    selectedAgent: string | null,
    selectedProject: string | null,
    dateStart: string | null
    dateEnd: string | null
  },
  events: CustomEventInput[]
}

interface CustomEventInput extends EventInput {
  agent?: string;
  project?: string;
}

const initialState: State = {
  formEvent: {
    id: null,
    selectedAgent: null,
    selectedProject: null,
    dateStart: null,
    dateEnd: null
  },
  events: []
}

export const CalendarFeature = createFeature({
  name: 'calendar',
  reducer: createReducer(
    initialState,
    on(CalendarActions.createEvent, (state, {event}) => ({...state, events: [...state.events, event]})),
    on(CalendarActions.deleteEvent, (state, {id}) => ({...state, events: state.events.filter(e => e.id !== id)})),
    on(CalendarActions.formEvent, (state, {id, selectedAgent, selectedProject, dateStart, dateEnd}) => ({
      ...state,
      formEvent:
        {id, selectedAgent, selectedProject, dateStart, dateEnd},
    }))
  )
});

