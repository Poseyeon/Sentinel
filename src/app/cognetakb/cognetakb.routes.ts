import { Routes } from '@angular/router';
import { CognetaKBComponent } from './cognetakb.component';
import { KBHomeComponent } from './home/kb-home.component';

export const COGNETA_KB_ROUTES: Routes = [
  {
    path: '',
    component: CognetaKBComponent,
    children: [
      { path: 'home', component: KBHomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      // Sub-routes for KB
      { path: 'documents', component: KBHomeComponent }, // Placeholder
      { path: 'search', component: KBHomeComponent },    // Placeholder
    ]
  }
];
