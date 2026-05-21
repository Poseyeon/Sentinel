import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cognetakb',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="kb-app-container">
      <mat-toolbar color="primary" class="kb-header">
        <button mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="kb-title">CognetaKB</span>
        <span class="spacer"></span>
        <button mat-button routerLink="/home">
          <mat-icon>home</mat-icon>
          Back to Poseyeon
        </button>
      </mat-toolbar>

      <mat-sidenav-container class="kb-sidenav-container">
        <mat-sidenav #sidenav mode="side" opened class="kb-sidenav">
          <mat-nav-list>
            <a mat-list-item routerLink="./home" routerLinkActive="active">
              <mat-icon matListItemIcon>auto_stories</mat-icon>
              <span matListItemTitle>Knowledge Base</span>
            </a>
            <a mat-list-item routerLink="./documents" routerLinkActive="active">
              <mat-icon matListItemIcon>description</mat-icon>
              <span matListItemTitle>Documents</span>
            </a>
            <a mat-list-item routerLink="./search" routerLinkActive="active">
              <mat-icon matListItemIcon>search</mat-icon>
              <span matListItemTitle>Advanced Search</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="kb-content">
          <div class="kb-page-wrapper">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .kb-app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .kb-header {
      z-index: 2;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      background-color: #673ab7 !important; /* Deep Purple for KB */
    }
    .spacer { flex: 1 1 auto; }
    .kb-sidenav-container {
      flex: 1;
    }
    .kb-sidenav {
      width: 240px;
      background: #fafafa;
      border-right: 1px solid #e0e0e0;
    }
    .kb-content {
      padding: 0;
      background: #fdfdfd;
    }
    .kb-page-wrapper {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .active {
      background: rgba(103, 58, 183, 0.1);
      color: #673ab7;
      font-weight: 500;
    }
  `]
})
export class CognetaKBComponent {}
