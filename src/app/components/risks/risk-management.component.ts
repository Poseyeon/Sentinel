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
import { RiskService } from '../../services/risk.service';
import { CreateRiskDialogComponent } from './create-risk-dialog.component';
import { RiskDto, RiskAnalyticsByCategory } from '../../models/risk.dto';

@Component({
  selector: 'app-risk-management',
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
  template: `
    <mat-card class="asset-shell">
      <mat-card-header (click)="toggleManagement()" style="cursor: pointer;">
        <div style="display: flex; flex-direction: column;">
          <mat-card-title>Risk Management</mat-card-title>
          <mat-card-subtitle>Company {{ companyId }}</mat-card-subtitle>
        </div>
        <span class="spacer"></span>
        <button mat-icon-button matTooltip="Add risk" (click)="$event.stopPropagation(); openCreateRiskDialog()">
          <mat-icon>add</mat-icon>
        </button>
        <button mat-icon-button matTooltip="Refresh risks" (click)="$event.stopPropagation(); loadRisks()">
          <mat-icon>refresh</mat-icon>
        </button>
        <button mat-icon-button (click)="$event.stopPropagation(); toggleManagement()">
          <mat-icon>{{ isManagementCollapsed ? 'expand_more' : 'expand_less' }}</mat-icon>
        </button>
      </mat-card-header>
      <mat-card-content *ngIf="!isManagementCollapsed">
        <div class="table-wrapper">
          <table mat-table [dataSource]="risks" class="mat-elevation-z1 full-width">
            <ng-container matColumnDef="risk_id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let risk">{{ risk.risk_id }}</td>
            </ng-container>

            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let risk">{{ risk.mongo?.title || risk.title }}</td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let risk">{{ risk.mongo?.category || risk.category }}</td>
            </ng-container>

            <ng-container matColumnDef="impact">
              <th mat-header-cell *matHeaderCellDef>Impact</th>
              <td mat-cell *matCellDef="let risk">
                <mat-chip [color]="getImpactColor(risk.mongo?.impact || risk.impact)" selected>
                  {{ risk.mongo?.impact || risk.impact }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="likelihood">
              <th mat-header-cell *matHeaderCellDef>Likelihood</th>
              <td mat-cell *matCellDef="let risk">{{ risk.mongo?.likelihood || risk.likelihood }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let risk">
                <mat-chip [color]="getStatusColor(risk.mongo?.status || risk.status)" selected>
                  {{ risk.mongo?.status || risk.status }}
                </mat-chip>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </div>
        <div *ngIf="risks.length === 0" class="no-data-msg">
          No risks identified yet.
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card class="asset-shell">
      <mat-card-header (click)="toggleAnalytics()" style="cursor: pointer;">
        <mat-card-title>Risk Analytics</mat-card-title>
        <span class="spacer"></span>
        <button mat-icon-button matTooltip="Refresh analytics" (click)="$event.stopPropagation(); loadAnalytics()">
          <mat-icon>refresh</mat-icon>
        </button>
        <button mat-icon-button (click)="$event.stopPropagation(); toggleAnalytics()">
          <mat-icon>{{ isAnalyticsCollapsed ? 'expand_more' : 'expand_less' }}</mat-icon>
        </button>
      </mat-card-header>
      <mat-card-content *ngIf="!isAnalyticsCollapsed">
        <div class="charts-grid">
          <div class="chart-card">
            <h4>By Category</h4>
            <canvas baseChart [data]="byCategoryChartData" [type]="'bar'"></canvas>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .asset-shell {
      margin: 16px 0;
      border-radius: 12px;
      mat-card-header {
        display: flex;
        align-items: center;
        width: 100%;
      }
    }
    .spacer { flex: 1 1 auto; }
    .table-wrapper {
      overflow-x: auto;
      margin-top: 16px;
      margin-bottom: 16px;
      border: 1px solid #e6e8eb;
      border-radius: 10px;
    }
    .full-width { width: 100%; }
    .no-data-msg {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
      font-style: italic;
    }
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px;
      margin-top: 16px;
    }
    .chart-card {
      border: 1px solid #e6e8eb;
      border-radius: 12px;
      padding: 12px;
      background: #fff;
    }
  `]
})
export class RiskManagementComponent implements OnInit {
  @Input() companyId!: number;
  @Input() username!: string;

  private readonly riskService = inject(RiskService);
  private readonly dialog = inject(MatDialog);

  risks: any[] = [];
  isManagementCollapsed = false;
  isAnalyticsCollapsed = false;
  readonly displayedColumns = ['risk_id', 'title', 'category', 'impact', 'likelihood', 'status'];

  byCategoryChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Risks by Category' }],
  };

  ngOnInit(): void {
    this.loadRisks();
    this.loadAnalytics();
  }

  loadRisks(): void {
    this.riskService.getRisks(this.companyId).subscribe((risks) => {
      this.risks = risks;
    });
  }

  loadAnalytics(): void {
    this.riskService.getAnalyticsByCategory(this.companyId).subscribe((res: any) => {
      // Handle both array and object response based on risk-controlls.md and typical analytics shape
      const data = Array.isArray(res) ? res : res.data || [];
      this.byCategoryChartData = {
        labels: data.map((row: any) => row.category || row.key),
        datasets: [{ data: data.map((row: any) => row.count), label: 'Risks by Category' }],
      };
    });
  }

  toggleManagement(): void { this.isManagementCollapsed = !this.isManagementCollapsed; }
  toggleAnalytics(): void { this.isAnalyticsCollapsed = !this.isAnalyticsCollapsed; }

  getImpactColor(impact: string): string {
    switch (impact) {
      case 'critical': return 'warn';
      case 'high': return 'accent';
      case 'medium': return 'primary';
      default: return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'mitigated':
      case 'closed': return 'primary';
      case 'critical': return 'warn';
      default: return '';
    }
  }

  openCreateRiskDialog(): void {
    const dialogRef = this.dialog.open(CreateRiskDialogComponent, {
      width: '600px',
      data: {
        username: this.username,
        companyId: this.companyId,
        title: '',
        category: 'cybersecurity',
        impact: 'medium',
        likelihood: 'medium',
        status: 'identified',
        description: '',
      },
    });

    dialogRef.afterClosed().subscribe((result: RiskDto) => {
      if (result) {
        this.riskService.createRisk(result).subscribe(() => {
          this.loadRisks();
          this.loadAnalytics();
        });
      }
    });
  }
}
