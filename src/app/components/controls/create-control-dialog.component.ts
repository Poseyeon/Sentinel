import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ControlDto, FrameworkRef } from '../../models/control.dto';

@Component({
  selector: 'app-create-control-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>Create New Control</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <!-- Basic Info -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="data.name" placeholder="Control Name" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="data.category" required>
            <mat-option value="preventive">Preventive</mat-option>
            <mat-option value="detective">Detective</mat-option>
            <mat-option value="corrective">Corrective</mat-option>
            <mat-option value="administrative">Administrative</mat-option>
            <mat-option value="technical">Technical</mat-option>
            <mat-option value="physical">Physical</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [(ngModel)]="data.status" required>
            <mat-option value="planned">Planned</mat-option>
            <mat-option value="implemented">Implemented</mat-option>
            <mat-option value="testing">Testing</mat-option>
            <mat-option value="effective">Effective</mat-option>
            <mat-option value="ineffective">Ineffective</mat-option>
            <mat-option value="retired">Retired</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="data.description" placeholder="Description" required></textarea>
        </mat-form-field>

        <!-- Implementation Section -->
        <div class="section-title full-width">Implementation Details</div>
        
        <mat-form-field appearance="outline">
          <mat-label>Method</mat-label>
          <input matInput [(ngModel)]="data.implementation.method" placeholder="e.g. Software-basiert" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Responsible Team</mat-label>
          <input matInput [(ngModel)]="data.implementation.responsible_team" placeholder="e.g. IT-Security" required />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Automation Level</mat-label>
          <mat-select [(ngModel)]="data.implementation.automation_level" required>
            <mat-option value="manual">Manual</mat-option>
            <mat-option value="semi-automated">Semi-automated</mat-option>
            <mat-option value="fully-automated">Fully-automated</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Effectiveness Section -->
        <div class="section-title full-width">Effectiveness</div>

        <mat-form-field appearance="outline">
          <mat-label>Rating</mat-label>
          <mat-select [(ngModel)]="data.effectiveness.rating" required>
            <mat-option value="ineffective">Ineffective</mat-option>
            <mat-option value="partially effective">Partially Effective</mat-option>
            <mat-option value="effective">Effective</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Effectiveness Notes</mat-label>
          <input matInput [(ngModel)]="data.effectiveness.notes" placeholder="e.g. Erfolgreich getestet" />
        </mat-form-field>

        <!-- Framework Refs Section -->
        <div class="section-header-row full-width">
          <div class="section-title">Framework References</div>
          <button mat-icon-button color="primary" (click)="addFrameworkRef()" type="button">
            <mat-icon>add_circle</mat-icon>
          </button>
        </div>

        <div *ngFor="let ref of data.framework_refs; let i = index" class="framework-ref-row full-width">
          <mat-form-field appearance="outline">
            <mat-label>Framework</mat-label>
            <input matInput [(ngModel)]="ref.framework" placeholder="e.g. ISO27001" required />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Control Ref</mat-label>
            <input matInput [(ngModel)]="ref.control_reference" placeholder="e.g. A.5.1" required />
          </mat-form-field>
          <button mat-icon-button color="warn" (click)="removeFrameworkRef(i)" type="button">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="data" [disabled]="!isFormValid()">
        Create
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding-top: 8px;
    }
    .full-width {
      grid-column: span 2;
    }
    .section-title {
      font-weight: 600;
      color: #1a73e8;
      margin-top: 16px;
      margin-bottom: 4px;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .framework-ref-row {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 8px;
      align-items: center;
      background: #f8f9fa;
      padding: 8px;
      border-radius: 8px;
      margin-bottom: 4px;
    }
    mat-form-field {
      width: 100%;
    }
    textarea {
      min-height: 80px;
    }
  `]
})
export class CreateControlDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateControlDialogComponent>);
  readonly data = inject<ControlDto>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }

  addFrameworkRef(): void {
    this.data.framework_refs.push({ framework: '', control_reference: '' });
  }

  removeFrameworkRef(index: number): void {
    this.data.framework_refs.splice(index, 1);
  }

  isFormValid(): boolean {
    const basicValid = !!(
      this.data.name &&
      this.data.category &&
      this.data.status &&
      this.data.description
    );

    const implementationValid = !!(
      this.data.implementation.method &&
      this.data.implementation.responsible_team &&
      this.data.implementation.automation_level
    );

    const effectivenessValid = !!this.data.effectiveness.rating;

    const frameworkRefsValid = this.data.framework_refs.every(
      ref => ref.framework && ref.control_reference
    );

    return basicValid && implementationValid && effectivenessValid && frameworkRefsValid;
  }
}
