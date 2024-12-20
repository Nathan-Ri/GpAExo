import { EventInput } from '@fullcalendar/core';
import { createFeature, createReducer, on } from '@ngrx/store';
import * as CalendarActions from './actions';

interface State {
  events: CustomEventInput[]
}

interface CustomEventInput extends EventInput {
  agent?: string;
  project?: string;
}

const initialState: State = {
  events: []
}

export const CalendarFeature = createFeature({
  name: 'calendar',
  reducer: createReducer(
    initialState,
    on(CalendarActions.createEvent, (state, { event }) => ({ ...state, events: [...state.events, event] })),
    on(CalendarActions.deleteEvent, (state, { id }) => ({ ...state, events: state.events.filter(e => e.id !== id) }))
  )
});

