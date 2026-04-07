import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../navigation/navigation.component';
import { CreateUserComponent } from '../create-user/create-user.component';
import { Router } from '@angular/router';
import {
  AnalyticsByMonthItem,
  AnalyticsItem,
  AnalyticsSummary,
  Asset,
  AssetService,
  CreateAssetPayload,
  UpdateAssetPayload,
} from '../../services/asset.service';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    CommonModule,
    NavigationComponent,
    CreateUserComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly assetService = inject(AssetService);
  user = this.authService.getUser();
  readonly companyId = Number(this.user?.companyId || 0);

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Asset-Management', route: '/asset-management' },
    { label: 'Risk Assessment', route: '/risk-assessment' },
    { label: 'Policies', route: '/policies' },
    { label: 'Compliance and Audit', route: '/compliance-audit' },
    { label: 'Incident-Management', route: '/incident-management' },
  ];

  searchQuery: string = '';
  statusMessage = '';
  errorMessage = '';

  assetIdInput: number | null = null;
  selectedAssetId: number | null = null;
  assets: Asset[] = [];

  createAssetModel: CreateAssetPayload = {
    name: '',
    type: '',
    username: this.user?.username || '',
    companyId: this.companyId,
    description: '',
    classification: '',
    location: '',
    owner: '',
    value: '',
    status: 'active',
  };

  updateAssetModel: UpdateAssetPayload = {
    name: '',
    type: '',
    description: '',
    classification: '',
    location: '',
    owner: '',
    value: '',
    status: '',
  };

  analyticsByType: AnalyticsItem[] = [];
  analyticsByStatus: AnalyticsItem[] = [];
  analyticsByValue: AnalyticsItem[] = [];
  analyticsByClassification: AnalyticsItem[] = [];
  analyticsByMonth: AnalyticsByMonthItem[] = [];
  analyticsSummary: AnalyticsSummary | null = null;

  ngOnInit(): void {
    if (this.companyId > 0) {
      this.loadAnalytics();
    }
  }

  onSearch(): void {
    // Handle search functionality
    console.log('Searching for:', this.searchQuery);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  createAsset(): void {
    this.clearMessages();

    if (!this.createAssetModel.name || !this.createAssetModel.type || !this.createAssetModel.username || !this.companyId) {
      this.errorMessage = 'Name, type, username and companyId are required.';
      return;
    }

    this.assetService.createAsset(this.createAssetModel).subscribe({
      next: (res) => {
        this.statusMessage = `${res.message} (ID: ${res.assetId})`;
        this.selectedAssetId = res.assetId;
        this.assetIdInput = res.assetId;
        this.getAssetById(res.assetId);
        this.loadAnalytics();
      },
      error: (err) => this.handleError(err),
    });
  }

  getAssetById(assetId?: number | null): void {
    this.clearMessages();
    const id = Number(assetId ?? this.assetIdInput);
    if (!id) {
      this.errorMessage = 'Please provide a numeric asset ID.';
      return;
    }

    this.assetService.getAssetById(id).subscribe({
      next: (res) => {
        this.selectedAssetId = res.asset.asset_id;
        this.assetIdInput = res.asset.asset_id;
        this.upsertAsset(res.asset);
        this.populateUpdateModel(res.asset);
        this.statusMessage = `Loaded asset #${res.asset.asset_id}.`;
      },
      error: (err) => this.handleError(err),
    });
  }

  updateAsset(): void {
    this.clearMessages();
    const id = Number(this.selectedAssetId ?? this.assetIdInput);
    if (!id) {
      this.errorMessage = 'Load/select an asset first.';
      return;
    }

    this.assetService.updateAsset(id, this.updateAssetModel).subscribe({
      next: (res) => {
        this.statusMessage = res.message;
        this.getAssetById(id);
        this.loadAnalytics();
      },
      error: (err) => this.handleError(err),
    });
  }

  deleteAsset(assetId?: number): void {
    this.clearMessages();
    const id = Number(assetId ?? this.selectedAssetId ?? this.assetIdInput);
    if (!id) {
      this.errorMessage = 'Please provide a numeric asset ID.';
      return;
    }

    this.assetService.deleteAsset(id).subscribe({
      next: (res) => {
        this.statusMessage = res.message;
        this.assets = this.assets.filter((asset) => asset.asset_id !== id);
        if (this.selectedAssetId === id) {
          this.selectedAssetId = null;
        }
        this.loadAnalytics();
      },
      error: (err) => this.handleError(err),
    });
  }

  loadAnalytics(): void {
    if (!this.companyId) {
      this.errorMessage = 'Missing company ID for analytics.';
      return;
    }

    this.assetService.getAnalyticsByType(this.companyId).subscribe({
      next: (res) => (this.analyticsByType = res.data),
      error: (err) => this.handleError(err),
    });

    this.assetService.getAnalyticsByStatus(this.companyId).subscribe({
      next: (res) => (this.analyticsByStatus = res.data),
      error: (err) => this.handleError(err),
    });

    this.assetService.getAnalyticsByValue(this.companyId).subscribe({
      next: (res) => (this.analyticsByValue = res.data),
      error: (err) => this.handleError(err),
    });

    this.assetService.getAnalyticsByClassification(this.companyId).subscribe({
      next: (res) => (this.analyticsByClassification = res.data),
      error: (err) => this.handleError(err),
    });

    this.assetService.getAnalyticsByMonth(this.companyId).subscribe({
      next: (res) => (this.analyticsByMonth = res.data),
      error: (err) => this.handleError(err),
    });

    this.assetService.getAnalyticsSummary(this.companyId).subscribe({
      next: (res) => (this.analyticsSummary = res.data),
      error: (err) => this.handleError(err),
    });
  }

  selectAsset(asset: Asset): void {
    this.selectedAssetId = asset.asset_id;
    this.assetIdInput = asset.asset_id;
    this.populateUpdateModel(asset);
  }

  private upsertAsset(asset: Asset): void {
    const existingIndex = this.assets.findIndex((item) => item.asset_id === asset.asset_id);
    if (existingIndex >= 0) {
      this.assets[existingIndex] = asset;
      return;
    }

    this.assets = [asset, ...this.assets];
  }

  private populateUpdateModel(asset: Asset): void {
    this.updateAssetModel = {
      name: asset.name || '',
      type: asset.type || '',
      description: asset.description || '',
      classification: asset.classification || '',
      location: asset.location || '',
      owner: asset.owner || '',
      value: asset.value || '',
      status: asset.status || '',
    };
  }

  private clearMessages(): void {
    this.statusMessage = '';
    this.errorMessage = '';
  }

  private handleError(err: { status?: number; error?: { message?: string } }): void {
    this.statusMessage = '';
    if (err?.status === 404) {
      this.errorMessage = 'Asset not found.';
      return;
    }
    if (err?.status === 400) {
      this.errorMessage = err?.error?.message || 'Validation failed.';
      return;
    }
    this.errorMessage = err?.error?.message || 'Request failed. Please retry.';
  }
}
