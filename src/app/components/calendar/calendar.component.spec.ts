import {TestBed, ComponentFixture} from '@angular/core/testing';
import {CalendarComponent} from './calendar.component';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {FullCalendarModule} from '@fullcalendar/angular';
import * as CalendarActions from './actions';
import {EventClickArg} from '@fullcalendar/core';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let store: MockStore;

  const initialState = {
    calendar: {
      events: []
    },
    projects: [
      'Super Secret Project1',
      'Super Secret Project2',
      'Super Secret Project3',
      'vacances',
    ],
    agents: [
      'Super Secret Agent 1',
      'Super Secret Agent 2',
      'Super Secret Agent 3',
    ]

  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FullCalendarModule, CalendarComponent],
      declarations: [],
      providers: [
        provideMockStore({initialState})
      ]
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
        dateStart: null,
        dateEnd: null
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
        view: {calendar: {unselect: jasmine.createSpy()}}
      } as any; // Mock DateSelectArg

      component.handleDateSelect(mockSelectInfo);
      const formValues = component.formGroup.value;

      expect(formValues.dateStart).toBe('01/12/2024');
      expect(formValues.dateEnd).toBe('05/12/2024');
      expect(mockSelectInfo.view.calendar.unselect).toHaveBeenCalled();
    });
  });

  describe('handleEventClick', () => {
    it('should handle event click and set dialogVisible to true', () => {
      // Mock de l'argument EventClickArg
      const mockSelectInfo: any = {
        event: {
          id: '1',
          startStr: '2024-12-20',
          endStr: '2024-12-21',
          extendedProps: {
            agent: 'John Doe',
            project: 'Project X',
          },
        } as any,
      };

      // Appel de la méthode
      component.handleEventClick(mockSelectInfo);

      // Vérifie que la boîte de dialogue est visible
      expect(component.dialogVisible).toBeTrue();

      // Vérifie que les valeurs du formulaire sont correctement définies
      expect(component.formGroup.value).toEqual({
        id: '1',
        selectedAgent: 'John Doe',
        selectedProject: 'Project X',
        dateStart: '20/12/2024', // La date est formatée en "fr-FR"
        dateEnd: '21/12/2024',
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
        dateStart: '20/12/2024',
        dateEnd: '22/12/2024',
      });

      component.saveEvent();

      expect(spyDispatch).toHaveBeenCalledWith(
        CalendarActions.createEvent({
          event: jasmine.objectContaining({
            id: '0',
            title: 'Agent 1',
            agent: 'Agent 1',
            project: 'Project 1',
            start: '2024-12-20T00:00:00.000Z',
            end: '2024-12-22T00:00:00.000Z',
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


  describe('Date Conversion Utility', () => {
    let utility: { convertToISOString: (dateStr: string) => string };

    beforeEach(() => {
      // Crée un utilitaire temporaire pour tester la méthode
      utility = {
        convertToISOString(dateStr: string): string {
          const [day, month, year] = dateStr.split('/').map(Number);
          const date = new Date(Date.UTC(year, month - 1, day)); // Crée une date en UTC
          return date.toISOString();
        },
      };
    });

    it('should convert "20/12/2024" to "2024-12-20T00:00:00.000Z"', () => {
      const input = '20/12/2024';
      const expected = '2024-12-20T00:00:00.000Z';
      const result = utility.convertToISOString(input);

      expect(result).toBe(expected);
    });

    it('should convert "01/01/2023" to "2023-01-01T00:00:00.000Z"', () => {
      const input = '01/01/2023';
      const expected = '2023-01-01T00:00:00.000Z';
      const result = utility.convertToISOString(input);

      expect(result).toBe(expected);
    });


    it('should throw an error for invalid format "2024-12-20"', () => {
      const input = '2024-12-20'; // Format incorrect
      expect(() => utility.convertToISOString(input)).toThrowError();
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
