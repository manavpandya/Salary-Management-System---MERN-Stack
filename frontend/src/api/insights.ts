import axios from 'axios';
import type { CountrySalaryInsight, JobTitleInsight } from '../types';

const api = axios.create({ baseURL: '/api' });

export async function fetchSalaryByCountry(): Promise<CountrySalaryInsight[]> {
  const { data } = await api.get<CountrySalaryInsight[]>('/insights/by-country');
  return data;
}

export async function fetchSalaryByJobTitle(
  country?: string
): Promise<JobTitleInsight[]> {
  const params = country ? { country } : undefined;
  const { data } = await api.get<JobTitleInsight[]>('/insights/by-job-title', { params });
  return data;
}