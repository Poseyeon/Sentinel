import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ControlDto } from '../../models/control.dto';

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
  ],
  template: `
    <h2 mat-dialog-title>Create New Control</h2>
    <mat-dialog-content>
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="data.name" placeholder="Control Name" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="data.category" required>
            <mat-option value="technical">Technical</mat-option>
            <mat-option value="organizational">Organizational</mat-option>
            <mat-option value="legal">Legal</mat-option>
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
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="data" [disabled]="!data.name || !data.category || !data.status || !data.description">
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
}
