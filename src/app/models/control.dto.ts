export interface ControlDto {
  control_id?: string;
  username: string;
  companyId: number;
  name: string;
  category: 'technical' | 'organizational' | 'legal'; // Example categories
  status: 'planned' | 'implemented' | 'testing' | 'effective' | 'ineffective' | 'retired';
  description: string;
}

export interface ControlAnalyticsByStatus {
  key: string;
  count: number;
}
