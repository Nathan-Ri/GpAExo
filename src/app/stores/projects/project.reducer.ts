import {createFeature, createReducer} from '@ngrx/store';

interface State {
  projects: string[]
}

const initialState: State = {
  projects: [
      'Super Secret Project1',
      'Super Secret Project2',
      'Super Secret Project3',
      'vacances',
    ]
}

export const ProjectFeature = createFeature({
  name: 'project',
  reducer: createReducer(
    initialState
  )
});
