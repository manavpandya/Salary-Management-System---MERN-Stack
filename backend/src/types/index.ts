export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface EmployeeFilters {
  search?: string;
  country?: string;
  jobTitle?: string;
}

export type SortOrder = 'asc' | 'desc';

export interface EmployeeSortOptions {
  sortBy?: 'fullName' | 'jobTitle' | 'country' | 'salary' | 'createdAt';
  sortOrder?: SortOrder;
}

export interface EmployeeListQuery extends PaginationQuery, EmployeeFilters, EmployeeSortOptions {}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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

export interface PaginatedJobTitleResponse {
  data: JobTitleInsight[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

