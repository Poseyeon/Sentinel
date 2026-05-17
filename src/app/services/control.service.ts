import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ControlDto, ControlAnalyticsByStatus } from '../models/control.dto';

@Injectable({
  providedIn: 'root',
})
export class ControlService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/controls';

  createControl(control: ControlDto): Observable<ControlDto> {
    return this.http.post<ControlDto>(this.apiUrl, control);
  }

  getControls(companyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?compId=${companyId}`);
  }

  getAnalyticsByCategory(companyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/analytics/by-category?companyId=${companyId}`);
  }
}
