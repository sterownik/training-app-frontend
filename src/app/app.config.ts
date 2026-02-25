import {
  ApplicationConfig,
  InjectionToken,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiHandlingInterceptor } from './api-handling-interceptor';
import { errorHandlingInterceptor } from './error-handling-interceptor';
import { LOCALE_ID } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiHandlingInterceptor])),
    provideHttpClient(withInterceptors([errorHandlingInterceptor])),
    { provide: LOCALE_ID, useValue: 'pl-PL' },
  ],
};
