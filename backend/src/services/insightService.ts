import prisma from './prisma';
import type { CountrySalaryInsight, JobTitleInsight, PaginatedJobTitleResponse } from '../types';

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

export async function getSalaryInsightsByJobTitle(
  country?: string,
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedJobTitleResponse> {
  const where = country ? { country } : undefined;

  const [results, total] = await Promise.all([
    prisma.employee.groupBy({
      by: ['jobTitle', 'country'],
      where,
      _avg: { salary: true },
      _count: { id: true },
      orderBy: [{ country: 'asc' }, { jobTitle: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    // Get total count from a separate count query
    prisma.employee.groupBy({
      by: ['jobTitle', 'country'],
      where,
      _count: true,
    }).then((r) => r.length),
  ]);

  const data = results.map((r) => ({
    jobTitle: r.jobTitle,
    country: r.country,
    avgSalary: Math.round((r._avg.salary ?? 0) * 100) / 100,
    employeeCount: r._count.id,
  }));

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getTotalSalaryStats(): Promise<{
  totalEmployees: number;
  overallAvgSalary: number;
  totalCountries: number;
  totalJobTitles: number;
}> {
  const [empCount, avgResult, countries, jobTitles] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.aggregate({ _avg: { salary: true } }),
    prisma.employee.findMany({ distinct: ['country'], select: { country: true } }),
    prisma.employee.findMany({ distinct: ['jobTitle'], select: { jobTitle: true } }),
  ]);

  return {
    totalEmployees: empCount,
    overallAvgSalary: Math.round((avgResult._avg.salary ?? 0) * 100) / 100,
    totalCountries: countries.length,
    totalJobTitles: jobTitles.length,
  };
}