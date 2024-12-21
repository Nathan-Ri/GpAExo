import {EventInput} from "@fullcalendar/core";
import {createAction, props} from "@ngrx/store";

export const createEvent = createAction('[Fullcalendar] Create Event', props<{ event: EventInput }>());
export const deleteEvent = createAction('[Fullcalendar] Delete Event', props<{ id: string }>());
export const formEvent =
  createAction('[Fullcalendar] Form Event', props<{
    id: string | null,
    selectedAgent: string | null,
    selectedProject: string | null,
    dateStart: string | null
    dateEnd: string | null
  }>());



