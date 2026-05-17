export interface FrameworkRef {
  framework: string;
  control_reference: string;
}

export interface ControlDto {
  control_id?: string;
  username: string;
  companyId: number;
  name: string;
  category: 'preventive' | 'detective' | 'corrective' | 'administrative' | 'technical' | 'physical';
  status: 'planned' | 'implemented' | 'testing' | 'effective' | 'ineffective' | 'retired';
  description: string;
  implementation: {
    method: string;
    responsible_team: string;
    automation_level: 'manual' | 'semi-automated' | 'fully-automated';
  };
  effectiveness: {
    rating: 'ineffective' | 'partially effective' | 'effective';
    notes: string;
  };
  framework_refs: FrameworkRef[];
}

export interface ControlAnalyticsByStatus {
  key: string;
  count: number;
}
