import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([tokenInterceptor])
    )
    // ...otros providers si los tienes
  ]
};