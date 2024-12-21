import {createFeature, createReducer} from '@ngrx/store';

interface State {
  agents: string[]
}

const initialState: State = {
  agents: [
      'Super Secret Agent 1',
      'Super Secret Agent 2',
      'Super Secret Agent 3',
    ]
}

export const AgentFeature = createFeature({
  name: 'agent',
  reducer: createReducer(
    initialState
  )
});
