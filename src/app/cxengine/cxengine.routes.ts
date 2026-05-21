import { Routes } from '@angular/router';
import { CxEngineComponent } from './cxengine.component';
import { CxDashboardComponent } from './dashboard/cx-dashboard.component';

export const CX_ENGINE_ROUTES: Routes = [
  {
    path: '',
    component: CxEngineComponent,
    children: [
      { path: 'dashboard', component: CxDashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // Add more sub-routes here as the "app" grows
      { path: 'customization', component: CxDashboardComponent }, 
      { path: 'templates', component: CxDashboardComponent },     
    ]
  }
];
