import {Component} from '@angular/core';
import {CalendarComponent} from '../../calendar/components/calendar.component';

@Component({
  selector: 'app-main',
  imports: [
    CalendarComponent,
  ],
  templateUrl: './main.component.html',
})
export class MainComponent {

}
