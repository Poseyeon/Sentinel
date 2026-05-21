import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kb-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatInputModule, MatFormFieldModule, FormsModule],
  template: `
    <div class="kb-home">
      <div class="search-hero">
        <h1>How can we help you?</h1>
        <mat-form-field appearance="outline" class="search-field">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput placeholder="Search knowledge base articles, documentation, etc.">
        </mat-form-field>
      </div>

      <div class="category-grid">
        <mat-card class="category-card">
          <mat-card-header>
            <mat-icon class="category-icon">rocket_launch</mat-icon>
            <mat-card-title>Getting Started</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Learn the basics of Poseyeon and how to set up your company profile.</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="category-card">
          <mat-card-header>
            <mat-icon class="category-icon">security</mat-icon>
            <mat-card-title>Risk Management</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Comprehensive guides on identifying, assessing, and mitigating risks.</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="category-card">
          <mat-card-header>
            <mat-icon class="category-icon">gavel</mat-icon>
            <mat-card-title>Compliance</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Documentation on different compliance frameworks and audits.</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .kb-home {
      display: flex;
      flex-direction: column;
      gap: 48px;
    }
    .search-hero {
      text-align: center;
      padding: 64px 0;
      h1 { font-size: 2.5rem; margin-bottom: 24px; color: #3c4043; }
      .search-field { width: 100%; max-width: 600px; }
    }
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
    .category-card {
      padding: 16px;
      border-radius: 12px;
      cursor: pointer;
      transition: box-shadow 0.2s ease;
      &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
      mat-card-header { align-items: center; margin-bottom: 16px; }
    }
    .category-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      margin-right: 16px;
      color: #673ab7;
    }
  `]
})
export class KBHomeComponent {}
