import api from './client';
import type { CountrySalaryInsight, JobTitleInsight, PaginatedResponse } from '../types';

/** Fetch min/max/avg salary grouped by country */
export async function fetchSalaryByCountry(): Promise<CountrySalaryInsight[]> {
  const { data } = await api.get<CountrySalaryInsight[]>('/insights/by-country');
  return data;
}

/** Fetch paginated avg salary by job title, optionally filtered by country */
export async function fetchSalaryByJobTitle(
  country?: string,
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedResponse<JobTitleInsight>> {
  const params: Record<string, string | number> = { page, limit };
  if (country) params.country = country;
  const { data } = await api.get<PaginatedResponse<JobTitleInsight>>('/insights/by-job-title', { params });
  return data;
}

export interface SalaryStats {
  totalEmployees: number;
  overallAvgSalary: number;
  totalCountries: number;
  totalJobTitles: number;
}

/** Fetch overall salary statistics across all employees */
export async function fetchSalaryStats(): Promise<SalaryStats> {
  const { data } = await api.get<SalaryStats>('/insights/stats');
  return data;
}