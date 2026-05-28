import { useQuery } from '@tanstack/react-query';
import { fetchSalaryByCountry, fetchSalaryByJobTitle } from '../api/insights';

export function useSalaryByCountry() {
  return useQuery({
    queryKey: ['insights', 'by-country'],
    queryFn: fetchSalaryByCountry,
  });
}

export function useSalaryByJobTitle(country?: string) {
  return useQuery({
    queryKey: ['insights', 'by-job-title', country],
    queryFn: () => fetchSalaryByJobTitle(country),
  });
}