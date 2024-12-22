import * as CalendarActions from '../actions/calendar.action';
import {CalendarFeature} from './calendar.reducer';

describe('CalendarFeature', () => {
  const initialState = {
    formEvent: {
      id: null,
      selectedAgent: null,
      selectedProject: null,
      dateStart: null,
      dateEnd: null,
    },
    events: [],
  };

  it('should return the initial state', () => {
    const state = CalendarFeature.reducer(undefined, { type: '@@init' });
    expect(state).toEqual(initialState);
  });

  it('should handle createEvent action', () => {
    const newEvent = {
      id: '1',
      title: 'New Event',
      start: '2024-12-22T10:00:00',
      end: '2024-12-22T12:00:00',
      agent: 'Agent X',
      project: 'Project Y',
    };

    const state = CalendarFeature.reducer(initialState, CalendarActions.createEvent({ event: newEvent }));

    expect(state.events.length).toBe(1);
    expect(state.events[0]).toEqual(newEvent);
  });

  it('should handle deleteEvent action', () => {
    const currentState = {
      ...initialState,
      events: [
        { id: '1', title: 'Event 1' },
        { id: '2', title: 'Event 2' },
      ],
    };

    const state = CalendarFeature.reducer(currentState, CalendarActions.deleteEvent({ id: '1' }));

    expect(state.events.length).toBe(1);
    expect(state.events[0].id).toBe('2');
  });

  it('should handle formEvent action', () => {
    const formEventPayload = {
      id: '123',
      selectedAgent: 'Agent A',
      selectedProject: 'Project B',
      dateStart: '2024-01-01',
      dateEnd: '2024-01-05',
    };

    const state = CalendarFeature.reducer(initialState, CalendarActions.formEvent(formEventPayload));

    expect(state.formEvent).toEqual(formEventPayload);
  });
});
