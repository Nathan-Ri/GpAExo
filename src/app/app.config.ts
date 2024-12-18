import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {provideStore, StoreModule} from '@ngrx/store';
import {CalendarFeature} from './components/calendar/reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom([
        BrowserModule,
        BrowserAnimationsModule,
    ]),
    providePrimeNG({
        theme: {
            preset: Aura
        }
    }),
    provideStore({calendar: CalendarFeature.reducer}),
]
};
