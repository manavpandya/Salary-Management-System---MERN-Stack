import axios from 'axios';
import type { CountrySalaryInsight, JobTitleInsight, PaginatedResponse } from '../types';

const api = axios.create({ baseURL: '/api' });

export async function fetchSalaryByCountry(): Promise<CountrySalaryInsight[]> {
  const { data } = await api.get<CountrySalaryInsight[]>('/insights/by-country');
  return data;
}

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

export async function fetchSalaryStats(): Promise<{
  totalEmployees: number;
  overallAvgSalary: number;
  totalCountries: number;
  totalJobTitles: number;
}> {
  const { data } = await api.get('/insights/stats');
  return data;
}