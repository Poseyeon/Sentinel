export interface RiskDto {
  risk_id?: string;
  username: string;
  companyId: number;
  title: string;
  category: 'cybersecurity' | 'compliance' | 'financial' | 'operational'; // Example categories, can be adjusted
  impact: 'low' | 'medium' | 'high' | 'critical';
  likelihood: 'low' | 'medium' | 'high' | 'very high';
  status: 'identified' | 'assessed' | 'mitigated' | 'accepted' | 'closed';
  description: string;
}

export interface RiskAnalyticsByCategory {
  category: string;
  count: number;
}
