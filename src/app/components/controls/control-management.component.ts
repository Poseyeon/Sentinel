import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ControlService } from '../../services/control.service';
import { CreateControlDialogComponent } from './create-control-dialog.component';
import { ControlDto } from '../../models/control.dto';

@Component({
  selector: 'app-control-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    BaseChartDirective,
  ],
  templateUrl: './control-management.component.html',
  styleUrl: './control-management.component.scss',
})
export class ControlManagementComponent implements OnInit {
  @Input() companyId!: number;
  @Input() username!: string;

  private readonly controlService = inject(ControlService);
  private readonly dialog = inject(MatDialog);

  controls: any[] = [];
  isManagementCollapsed = false;
  isAnalyticsCollapsed = false;
  readonly displayedColumns = ['control_id', 'name', 'category', 'status'];

  effectivenessChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Effectiveness', backgroundColor: ['#4caf50', '#f44336', '#ff9800'] }],
  };

  automationChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Automation Degree', backgroundColor: '#1a73e8' }],
  };

  frameworkChartData: ChartConfiguration<'radar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Framework Compliance' }],
  };

  horizontalBarOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
  };

  ngOnInit(): void {
    this.loadControls();
    this.loadAnalytics();
  }

  loadControls(): void {
    this.controlService.getControls(this.companyId).subscribe((controls) => {
      this.controls = controls;
    });
  }

  loadAnalytics(): void {
    this.controlService.getAnalyticsByEffectiveness(this.companyId).subscribe((res: any) => {
      const data = Array.isArray(res) ? res : res.data || [];
      this.effectivenessChartData = {
        labels: data.map((row: any) => row.key),
        datasets: [{ 
          data: data.map((row: any) => row.count), 
          label: 'Effectiveness',
          backgroundColor: data.map((row: any) => this.getEffectivenessColor(row.key))
        }],
      };
    });

    this.controlService.getAnalyticsByAutomation(this.companyId).subscribe((res: any) => {
      const data = Array.isArray(res) ? res : res.data || [];
      this.automationChartData = {
        labels: data.map((row: any) => row.key),
        datasets: [{ data: data.map((row: any) => row.count), label: 'Automation Degree', backgroundColor: '#1a73e8' }],
      };
    });

    this.controlService.getAnalyticsByFramework(this.companyId).subscribe((res: any) => {
      const data = Array.isArray(res) ? res : res.data || [];
      this.frameworkChartData = {
        labels: data.map((row: any) => row.key),
        datasets: [{ 
          data: data.map((row: any) => row.count), 
          label: 'Framework Compliance',
          fill: true,
          backgroundColor: 'rgba(26, 115, 232, 0.2)',
          borderColor: '#1a73e8',
          pointBackgroundColor: '#1a73e8',
        }],
      };
    });
  }

  getEffectivenessColor(key: string): string {
    switch (key.toLowerCase()) {
      case 'effective': return '#4caf50';
      case 'ineffective': return '#f44336';
      case 'testing': return '#ff9800';
      default: return '#9e9e9e';
    }
  }

  toggleManagement(): void { this.isManagementCollapsed = !this.isManagementCollapsed; }
  toggleAnalytics(): void { this.isAnalyticsCollapsed = !this.isAnalyticsCollapsed; }

  getStatusColor(status: string): string {
    switch (status) {
      case 'effective':
      case 'implemented': return 'primary';
      case 'ineffective': return 'warn';
      default: return '';
    }
  }

  openCreateControlDialog(): void {
    const dialogRef = this.dialog.open(CreateControlDialogComponent, {
      width: '600px',
      data: {
        username: this.username,
        companyId: this.companyId,
        name: '',
        category: 'technical',
        status: 'planned',
        description: '',
        implementation: {
          method: '',
          responsible_team: '',
          automation_level: 'manual',
        },
        effectiveness: {
          rating: 'effective',
          notes: '',
        },
        framework_refs: [],
      },
    });

    dialogRef.afterClosed().subscribe((result: ControlDto) => {
      if (result) {
        this.controlService.createControl(result).subscribe(() => {
          this.loadControls();
          this.loadAnalytics();
        });
      }
    });
  }
}
