import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CalendarComponent} from './calendar.component';
import {FullCalendarModule} from '@fullcalendar/angular';
import {ReactiveFormsModule} from '@angular/forms';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {CalendarFeature} from '../reducers/calendar.reducer';
import * as CalendarActions from '../actions/calendar.action';
import {EventClickArg, DateSelectArg} from '@fullcalendar/core';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let mockStore: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FullCalendarModule,
        ReactiveFormsModule,
        CalendarComponent
      ],
      providers: [
        provideMockStore({
          initialState: {
            [CalendarFeature.name]: {
              events: []
            }
          }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call unselect on the calendar API', () => {
    // Création d'un mock pour DateSelectArg
    const mockCalendarApi = {
      unselect: jasmine.createSpy('unselect'),
    };

    const mockSelectionInfo: DateSelectArg = {
      start: new Date(),
      end: new Date(),
      startStr: '2024-12-01',
      endStr: '2024-12-02',
      allDay: false,
      jsEvent: new MouseEvent('click'),
      view: {
        calendar: mockCalendarApi,
      } as any,
    };

    // Appeler la méthode à tester
    component.clearCalendarSelection(mockSelectionInfo);

    // Vérifier que la méthode unselect a été appelée
    expect(mockCalendarApi.unselect).toHaveBeenCalled();
  });

  it('should set dialogVisible to true when a date is selected', () => {
    component.dialogVisible = false;
    const spy = spyOn(component, "clearCalendarSelection")
    const mockDateSelectArg: any = {};

    component.handleDateSelect(mockDateSelectArg);
    expect(spy).toHaveBeenCalled()
    expect(component.dialogVisible).toBeTrue();
  });
});
