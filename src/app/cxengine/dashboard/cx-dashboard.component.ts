import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-cx-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="cx-dashboard">
      <h1>CxEngine Dashboard</h1>
      <p>Welcome to the CxEngine application. Here you can manage your system customizations and templates.</p>
      
      <div class="stat-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-subtitle>Active Customizations</mat-card-subtitle>
            <mat-card-title>12</mat-card-title>
          </mat-card-header>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-subtitle>Custom Templates</mat-card-subtitle>
            <mat-card-title>45</mat-card-title>
          </mat-card-header>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-subtitle>System Health</mat-card-subtitle>
            <mat-card-title>Optimal</mat-card-title>
          </mat-card-header>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .cx-dashboard {
      h1 { margin-bottom: 8px; color: #3c4043; }
      p { margin-bottom: 32px; color: #5f6368; }
    }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }
    .stat-card {
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
      box-shadow: none !important;
    }
  `]
})
export class CxDashboardComponent {}
