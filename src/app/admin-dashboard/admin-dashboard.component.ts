import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [CommonModule], // ✅ Add CommonModule here to fix *ngIf and date pipe issues
})
export class AdminDashboardComponent implements OnInit {
  submissions: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchSubmissions();
  }

  fetchSubmissions(): void {
    this.http.get<any[]>('http://localhost:5000/get-submissions').subscribe({
      next: (data) => {
        console.log("✅ Data received:", data);
        this.submissions = data;
      },
      error: (error) => {
        console.error("❌ Error fetching data:", error);
        this.errorMessage = "❌ Failed to fetch submissions.";
      }
    });
  }
}
