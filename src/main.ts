import { bootstrapApplication } from '@angular/platform-browser';
import { EmployeeAssessmentComponent } from './app/employee-assessment/employee-assessment.component'; // Correct your file path if needed

bootstrapApplication(EmployeeAssessmentComponent)
  .catch(err => console.error(err));
