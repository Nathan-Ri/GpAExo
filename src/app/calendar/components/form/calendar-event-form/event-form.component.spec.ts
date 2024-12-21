import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { EventFormComponent } from './event-form.component';
import { of } from 'rxjs';
import * as CalendarActions from '../../../actions/calendar.action';
import { createEventId, getColor } from '../../../../utils/event.utils';
import { convertToISOString } from '../../../../utils/date.utils';
import {provideMockStore} from '@ngrx/store/testing';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;
  let store: Store;
  let dispatchSpy: jasmine.Spy;

  const initialState = {
    agents: [{ id: '1', name: 'Agent A' }],
    projects: [{ id: '1', name: 'Project A' }],
    calendar: { formEvent: null },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        provideMockStore({ initialState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dispatchSpy = spyOn(store, 'dispatch');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form group with default values', () => {
    expect(component.formGroup.value).toEqual({
      id: null,
      selectedAgent: null,
      selectedProject: null,
      dateStart: null,
      dateEnd: null,
    });
  });

  it('should subscribe to formEvent$ and update the formGroup on value change', () => {
    const mockFormEvent = {
      id: '123',
      selectedAgent: 'Agent A',
      selectedProject: 'Project A',
      dateStart: '2024-01-01',
      dateEnd: '2024-01-05',
    };

    spyOn(store, 'select').and.returnValue(of(mockFormEvent));

    expect(component.formGroup.value).toEqual(mockFormEvent);
  });

  it('should dispatch createEvent action on valid form submission', () => {
    const mockFormEvent = {
      id: null,
      selectedAgent: 'Agent A',
      selectedProject: 'Project A',
      dateStart: '2024-01-01',
      dateEnd: '2024-01-05',
    };

    const mockEvent = {
      id: 'mock-id',
      title: 'Agent A',
      start: convertToISOString('2024-01-01'),
      end: convertToISOString('2024-01-05'),
      allDay: true,
      backgroundColor: getColor('Project A'),
      agent: 'Agent A',
      project: 'Project A',
    };

    spyOn(component.formGroup, 'get').and.callFake((key: string) => ({
      value: key === 'id' ? null : mockFormEvent[key as keyof typeof mockFormEvent],
    }));

    spyOn(createEventId, 'call').and.returnValue('mock-id');

    component.saveEvent();

    expect(dispatchSpy).toHaveBeenCalledWith(CalendarActions.createEvent({ event: mockEvent }));
  });

  it('should not dispatch createEvent action if form is invalid', () => {
    component.formGroup.patchValue({
      selectedAgent: null, // Required field is missing
      selectedProject: 'Project A',
      dateStart: '2024-01-01',
      dateEnd: '2024-01-05',
    });

    component.saveEvent();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should emit dialogVisibleChange on closeDialog', () => {
    spyOn(component.dialogVisibleChange, 'emit');
    component.closeDialog();
    expect(component.dialogVisibleChange.emit).toHaveBeenCalled();
  });

  it('should unsubscribe on component destroy', () => {
    const unsubscribeSpy = spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
