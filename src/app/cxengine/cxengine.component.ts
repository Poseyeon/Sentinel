import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cxengine',
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
    <div class="cx-app-container">
      <mat-toolbar color="accent" class="cx-header">
        <button mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="cx-title">CxEngine</span>
        <span class="spacer"></span>
        <button mat-button routerLink="/home">
          <mat-icon>home</mat-icon>
          Back to Poseyeon
        </button>
      </mat-toolbar>

      <mat-sidenav-container class="cx-sidenav-container">
        <mat-sidenav #sidenav mode="side" opened class="cx-sidenav">
          <mat-nav-list>
            <a mat-list-item routerLink="./dashboard" routerLinkActive="active">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            <a mat-list-item routerLink="./customization" routerLinkActive="active">
              <mat-icon matListItemIcon>settings_suggest</mat-icon>
              <span matListItemTitle>Customization</span>
            </a>
            <a mat-list-item routerLink="./templates" routerLinkActive="active">
              <mat-icon matListItemIcon>description</mat-icon>
              <span matListItemTitle>Templates</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="cx-content">
          <div class="cx-page-wrapper">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .cx-app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .cx-header {
      z-index: 2;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .spacer { flex: 1 1 auto; }
    .cx-sidenav-container {
      flex: 1;
    }
    .cx-sidenav {
      width: 240px;
      background: #fafafa;
      border-right: 1px solid #e0e0e0;
    }
    .cx-content {
      padding: 0;
      background: #f5f7f9;
    }
    .cx-page-wrapper {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .active {
      background: rgba(255, 64, 129, 0.1);
      color: #ff4081;
      font-weight: 500;
    }
  `]
})
export class CxEngineComponent {}
