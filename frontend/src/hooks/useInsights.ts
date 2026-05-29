import { useQuery } from '@tanstack/react-query';
import { fetchSalaryByCountry, fetchSalaryByJobTitle, fetchSalaryStats } from '../api/insights';

export function useSalaryByCountry() {
  return useQuery({
    queryKey: ['insights', 'by-country'],
    queryFn: fetchSalaryByCountry,
  });
}

export function useSalaryByJobTitle(country?: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['insights', 'by-job-title', country, page, limit],
    queryFn: () => fetchSalaryByJobTitle(country, page, limit),
  });
}

export function useSalaryStats() {
  return useQuery({
    queryKey: ['insights', 'stats'],
    queryFn: fetchSalaryStats,
    staleTime: 60_000,
  });
}