import { TestBed } from '@angular/core/testing';
import {AgentFeature} from './agent.reducer';

describe('AgentFeature', () => {
  it('should have the correct initial state', () => {
    const initialState = AgentFeature.reducer(undefined, { type: '@@init' });

    expect(initialState).toEqual({
      agents: [
        'Super Secret Agent 1',
        'Super Secret Agent 2',
        'Super Secret Agent 3',
      ],
    });
  });

  it('should have the correct feature name', () => {
    expect(AgentFeature.name).toBe('agent');
  });
});
