import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withRouterConfig} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors, withXhr} from '@angular/common/http';
import {provideToastr} from 'ngx-toastr';
import {provideAnimations} from '@angular/platform-browser/animations';
import {authTokenInterceptor} from '../../interceptors/auth-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withRouterConfig({
      onSameUrlNavigation: 'reload'
    })),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(withXhr(), 
      withInterceptors([authTokenInterceptor])
    )],
};
