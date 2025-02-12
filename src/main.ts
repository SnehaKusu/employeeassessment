import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { EmployeeAssessmentComponent } from './app/employee-assessment/employee-assessment.component';
import { AdminDashboardComponent } from './app/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  { path: '', component: EmployeeAssessmentComponent },  // ✅ Default Route
  { path: 'admin', component: AdminDashboardComponent } // ✅ Admin Dashboard Route
];

bootstrapApplication(EmployeeAssessmentComponent, {
  providers: [
    provideRouter(routes),  // ✅ Provide Routing
    provideHttpClient()     // ✅ Provide HttpClient for API Calls
  ]
}).catch(err => console.error(err));
