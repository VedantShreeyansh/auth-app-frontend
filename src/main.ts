import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from '../src/app/app.component';
import { AuthInterceptorService } from '../src/app/services/auth-interceptor.service';
import { appConfig } from '../src/app/app.config'; // Ensure you have the correct import for your appConfig

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers, // Use spread operator to include existing providers
    provideHttpClient(withInterceptorsFromDi()) // Add the AuthInterceptor
  ]
}).catch((err) => console.error(err));
