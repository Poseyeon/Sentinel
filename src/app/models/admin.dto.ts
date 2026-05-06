export interface AdminUserDto {
  userId?: number;
  user_id?: number;
  USER_ID?: number;
  username?: string;
  USER_ABBR?: string;
  firstname?: string;
  USER_FIRST_NAME?: string;
  surname?: string;
  USER_SURNAME?: string;
  role?: string;
  USER_ROLE?: string;
  companyId?: string;
  company_id?: string;
}

export interface AdminStatsDto {
  totalUsers: number;
  totalCompanies: number;
}
