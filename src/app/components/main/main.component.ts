import {Component} from '@angular/core';
import {CalendarComponent} from '../calendar/calendar.component';

@Component({
  selector: 'app-main',
  imports: [
    CalendarComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {


}
