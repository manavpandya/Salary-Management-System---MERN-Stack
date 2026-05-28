import axios from 'axios';
import type { Employee, PaginatedResponse, EmployeeFilters, EmployeeFormData } from '../types';

const api = axios.create({ baseURL: '/api' });

export async function fetchEmployees(
  filters: EmployeeFilters
): Promise<PaginatedResponse<Employee>> {
  const params: Record<string, string | number> = {};

  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.search) params.search = filters.search;
  if (filters.country) params.country = filters.country;
  if (filters.jobTitle) params.jobTitle = filters.jobTitle;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;

  const { data } = await api.get<PaginatedResponse<Employee>>('/employees', { params });
  return data;
}

export async function fetchEmployee(id: number): Promise<Employee> {
  const { data } = await api.get<Employee>(`/employees/${id}`);
  return data;
}

export async function createEmployee(input: EmployeeFormData): Promise<Employee> {
  const { data } = await api.post<Employee>('/employees', input);
  return data;
}

export async function updateEmployee(id: number, input: Partial<EmployeeFormData>): Promise<Employee> {
  const { data } = await api.put<Employee>(`/employees/${id}`, input);
  return data;
}

export async function deleteEmployee(id: number): Promise<void> {
  await api.delete(`/employees/${id}`);
}

export async function fetchCountries(): Promise<string[]> {
  const { data } = await api.get<string[]>('/employees/countries');
  return data;
}

export async function fetchJobTitles(): Promise<string[]> {
  const { data } = await api.get<string[]>('/employees/job-titles');
  return data;
}