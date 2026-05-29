import prisma from './prisma';
import type { CountrySalaryInsight, JobTitleInsight } from '../types';

export async function getSalaryInsightsByCountry(): Promise<CountrySalaryInsight[]> {
  const results = await prisma.employee.groupBy({
    by: ['country'],
    _min: { salary: true },
    _max: { salary: true },
    _avg: { salary: true },
    _count: { id: true },
    orderBy: { country: 'asc' },
  });

  return results.map((r) => ({
    country: r.country,
    minSalary: r._min.salary ?? 0,
    maxSalary: r._max.salary ?? 0,
    avgSalary: Math.round((r._avg.salary ?? 0) * 100) / 100,
    employeeCount: r._count.id,
  }));
}

export async function getSalaryInsightsByJobTitle(country?: string): Promise<JobTitleInsight[]> {
  const results = await prisma.employee.groupBy({
    by: ['jobTitle', 'country'],
    where: country ? { country } : undefined,
    _avg: { salary: true },
    _count: { id: true },
    orderBy: [{ country: 'asc' }, { jobTitle: 'asc' }],
  });

  return results.map((r) => ({
    jobTitle: r.jobTitle,
    country: r.country,
    avgSalary: Math.round((r._avg.salary ?? 0) * 100) / 100,
    employeeCount: r._count.id,
  }));
}