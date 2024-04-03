import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';



export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(), importProvidersFrom(HttpClientModule), provideRouter(routes)]
};
