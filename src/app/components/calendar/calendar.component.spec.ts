import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import * as CalendarActions from './actions';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let store: MockStore;

  const initialState = {
    calendar: {
      events: []
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FullCalendarModule, CalendarComponent],
      declarations: [],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('formGroup initialization', () => {
    it('should initialize the form with default values', () => {
      const formValues = component.formGroup.value;
      expect(formValues).toEqual({
        id: null,
        selectedAgent: null,
        selectedProject: null,
        dateStart: jasmine.any(Date),
        dateEnd: jasmine.any(Date)
      });
    });

    it('should mark the form as invalid when required fields are missing', () => {
      component.formGroup.setValue({
        id: null,
        selectedAgent: null,
        selectedProject: null,
        dateStart: null,
        dateEnd: null
      });
      expect(component.formGroup.valid).toBeFalse();
    });

    it('should mark the form as valid when required fields are provided', () => {
      component.formGroup.setValue({
        id: null,
        selectedAgent: 'Agent 1',
        selectedProject: 'Project 1',
        dateStart: new Date(),
        dateEnd: new Date()
      });
      expect(component.formGroup.valid).toBeTrue();
    });
  });

  describe('handleDateSelect', () => {
    it('should populate the form with the selected dates', () => {
      const mockSelectInfo = {
        startStr: '2024-12-01',
        endStr: '2024-12-05',
        view: { calendar: { unselect: jasmine.createSpy() } }
      } as any; // Mock DateSelectArg

      component.handleDateSelect(mockSelectInfo);
      const formValues = component.formGroup.value;

      expect(formValues.dateStart).toBe('01/12/2024');
      expect(formValues.dateEnd).toBe('05/12/2024');
      expect(mockSelectInfo.view.calendar.unselect).toHaveBeenCalled();
    });
  });

  describe('handleEventClick', () => {
    it('should populate the form with event data on click', () => {
      const mockEvent = {
        id: '1',
        start: new Date('2024-12-01'),
        end: new Date('2024-12-02'),
        extendedProps: { agent: 'Agent 1', project: 'Project 1' }
      } as any; // Mock EventClickArg.event

      component.handleEventClick({ event: mockEvent } as any);
      const formValues = component.formGroup.value;

      expect(formValues).toEqual({
        id: '1',
        selectedAgent: 'Agent 1',
        selectedProject: 'Project 1',
        dateStart: new Date('2024-12-01'),
        dateEnd: new Date('2024-12-02')
      });
    });
  });

  describe('saveEvent', () => {
    it('should dispatch createEvent action when form is valid', () => {
      const spyDispatch = spyOn(store, 'dispatch');
      component.formGroup.setValue({
        id: null,
        selectedAgent: 'Agent 1',
        selectedProject: 'Project 1',
        dateStart: new Date('2024-12-01'),
        dateEnd: new Date('2024-12-02')
      });

      component.saveEvent();

      expect(spyDispatch).toHaveBeenCalledWith(
        CalendarActions.createEvent({
          event: jasmine.objectContaining({
            title: 'Agent 1',
            agent: 'Agent 1',
            project: 'Project 1',
            start: jasmine.any(String),
            end: jasmine.any(String)
          })
        })
      );
    });

    it('should not dispatch createEvent action when form is invalid', () => {
      const spyDispatch = spyOn(store, 'dispatch');
      component.formGroup.setValue({
        id: null,
        selectedAgent: null,
        selectedProject: null,
        dateStart: null,
        dateEnd: null
      });

      component.saveEvent();

      expect(spyDispatch).not.toHaveBeenCalled();
    });
  });

  describe('convertToISOString', () => {
    it('should convert a date string to ISO format', () => {
      const dateStr = '01/12/2024';
      const isoDate = component.convertToISOString(dateStr);
      console.log(isoDate)
      expect(isoDate).toBe('2024-12-01T00:00:00.000Z');
    });

    it('should return the input if it is already an ISO string', () => {
      const isoDate = '2024-12-01T00:00:00.000Z';
      expect(component.convertToISOString(isoDate)).toBe(isoDate);
    });
  });

  describe('getColor', () => {
    it('should return the correct color for a given project', () => {
      expect(component.getColor('Super Secret Project1')).toBe('#f00000');
      expect(component.getColor('Super Secret Project2')).toBe('#f000f0');
      expect(component.getColor('Super Secret Project3')).toBe('#00f000');
      expect(component.getColor('vacances')).toBe('#55555555');
      expect(component.getColor('unknown')).toBe('#55555555');
    });
  });
});
