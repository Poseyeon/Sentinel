import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Asset {
  asset_id: number;
  name: string;
  type: string;
  description?: string;
  classification?: string;
  location?: string;
  owner?: string;
  value?: string;
  status?: string;
  risks: unknown[];
  controls: unknown[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateAssetPayload {
  name: string;
  type: string;
  username: string;
  companyId: number;
  description?: string;
  classification?: string;
  location?: string;
  owner?: string;
  value?: string;
  status?: string;
}

export interface UpdateAssetPayload {
  name?: string;
  type?: string;
  description?: string;
  classification?: string;
  location?: string;
  owner?: string;
  value?: string;
  status?: string;
}

export interface ApiMessageResponse {
  success: boolean;
  message: string;
}

export interface CreateAssetResponse extends ApiMessageResponse {
  assetId: number;
}

export interface GetAssetResponse {
  success: boolean;
  asset: Asset;
}

export interface CompanyAssetListItem {
  asset_id: number;
  mysql?: {
    asset_id: number;
    user_cr_id: number;
    comp_id: number;
    last_upd: string | null;
  };
  mongo?: {
    asset_id: number;
    name?: string;
    type?: string;
    description?: string;
    classification?: string;
    location?: string;
    owner?: string;
    value?: string;
    status?: string;
    risks?: unknown[];
    controls?: unknown[];
    created_at?: string;
    updated_at?: string;
  };
}

export interface AnalyticsItem {
  key: string;
  count: number;
}

export interface AnalyticsByMonthItem {
  year: number;
  month: number;
  monthName: string;
  label: string;
  count: number;
}

export interface AnalyticsSummary {
  totalAssets: number;
  highValueAssets: number;
  byType: AnalyticsItem[];
  byStatus: AnalyticsItem[];
  byValue: AnalyticsItem[];
}

export interface AnalyticsArrayResponse<T> {
  success: boolean;
  data: T[];
}

export interface AnalyticsSummaryResponse {
  success: boolean;
  data: AnalyticsSummary;
}

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private readonly assetsBaseUrl = '/api/assets';

  constructor(private readonly http: HttpClient) {}

  createAsset(payload: CreateAssetPayload): Observable<CreateAssetResponse> {
    return this.http.post<CreateAssetResponse>(this.assetsBaseUrl, payload);
  }

  getAssets(companyId: number): Observable<CompanyAssetListItem[]> {
    return this.http.get<CompanyAssetListItem[]>(`${this.assetsBaseUrl}?companyId=${Number(companyId)}`);
  }

  getAssetById(assetId: number): Observable<GetAssetResponse> {
    return this.http.get<GetAssetResponse>(`${this.assetsBaseUrl}/${Number(assetId)}`);
  }

  updateAsset(assetId: number, payload: UpdateAssetPayload): Observable<ApiMessageResponse> {
    return this.http.put<ApiMessageResponse>(`${this.assetsBaseUrl}/${Number(assetId)}`, payload);
  }

  deleteAsset(assetId: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(`${this.assetsBaseUrl}/${Number(assetId)}`);
  }

  getAnalyticsByType(companyId: number): Observable<AnalyticsArrayResponse<AnalyticsItem>> {
    return this.http.get<AnalyticsArrayResponse<AnalyticsItem>>(
      `${this.assetsBaseUrl}/analytics/by-type?companyId=${Number(companyId)}`,
    );
  }

  getAnalyticsByStatus(companyId: number): Observable<AnalyticsArrayResponse<AnalyticsItem>> {
    return this.http.get<AnalyticsArrayResponse<AnalyticsItem>>(
      `${this.assetsBaseUrl}/analytics/by-status?companyId=${Number(companyId)}`,
    );
  }

  getAnalyticsByValue(companyId: number): Observable<AnalyticsArrayResponse<AnalyticsItem>> {
    return this.http.get<AnalyticsArrayResponse<AnalyticsItem>>(
      `${this.assetsBaseUrl}/analytics/by-value?companyId=${Number(companyId)}`,
    );
  }

  getAnalyticsByClassification(companyId: number): Observable<AnalyticsArrayResponse<AnalyticsItem>> {
    return this.http.get<AnalyticsArrayResponse<AnalyticsItem>>(
      `${this.assetsBaseUrl}/analytics/by-classification?companyId=${Number(companyId)}`,
    );
  }

  getAnalyticsByMonth(companyId: number): Observable<AnalyticsArrayResponse<AnalyticsByMonthItem>> {
    return this.http.get<AnalyticsArrayResponse<AnalyticsByMonthItem>>(
      `${this.assetsBaseUrl}/analytics/by-month?companyId=${Number(companyId)}`,
    );
  }

  getAnalyticsSummary(companyId: number): Observable<AnalyticsSummaryResponse> {
    return this.http.get<AnalyticsSummaryResponse>(
      `${this.assetsBaseUrl}/analytics/summary?companyId=${Number(companyId)}`,
    );
  }

  downloadAssets(companyId: number): Observable<Blob> {
    return this.http.get(`${this.assetsBaseUrl}/export/docx/${Number(companyId)}`, {
      responseType: 'blob',
    });
  }
}
