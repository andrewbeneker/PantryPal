import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Provides HttpClient for API calls
    provideRouter(routes, withComponentInputBinding()), // Enables routing with component input binding
  ]}).catch(err => console.error(err));
