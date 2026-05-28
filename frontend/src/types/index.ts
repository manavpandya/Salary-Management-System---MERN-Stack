export interface Employee {
  id: number;
  fullName: string;
  jobTitle: string;
  country: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface EmployeeFilters {
  search?: string;
  country?: string;
  jobTitle?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CountrySalaryInsight {
  country: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  employeeCount: number;
}

export interface JobTitleInsight {
  jobTitle: string;
  country: string;
  avgSalary: number;
  employeeCount: number;
}

export interface EmployeeFormData {
  fullName: string;
  jobTitle: string;
  country: string;
  salary: number;
}