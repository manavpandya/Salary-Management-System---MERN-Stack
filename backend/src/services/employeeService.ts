import { Prisma } from '@prisma/client';
import prisma from './prisma';
import { AppError } from '../middleware/errorHandler';
import type { EmployeeListQuery, PaginatedResponse } from '../types';
import type { CreateEmployeeInput, UpdateEmployeeInput } from '../validators/employeeValidator';

const VALID_SORT_FIELDS = ['fullName', 'jobTitle', 'country', 'salary', 'createdAt'] as const;
const VALID_SORT_ORDERS = ['asc', 'desc'] as const;

/**
 * Sanitize search input: limit length, escape control characters
 */
function sanitizeSearch(input: string): string {
  return input.trim().replace(/[\x00-\x1f]/g, '').slice(0, 100);
}

export async function listEmployees(
  query: EmployeeListQuery,
): Promise<PaginatedResponse<Prisma.EmployeeGetPayload<object>>> {
  const { page, limit, search, country, jobTitle, sortBy = 'createdAt', sortOrder = 'desc' } = query;

  // Cap page to prevent deep offset performance issues
  const safePage = Math.min(page, 1000);
  const skip = (safePage - 1) * limit;

  // Validate sort params to prevent injection into orderBy
  const safeSortBy = VALID_SORT_FIELDS.includes(sortBy as any) ? sortBy : 'createdAt';
  const safeSortOrder = VALID_SORT_ORDERS.includes(sortOrder as any) ? sortOrder : 'desc';

  const where: Prisma.EmployeeWhereInput = {};

  if (country) {
    where.country = country;
  }
  if (jobTitle) {
    where.jobTitle = jobTitle;
  }

  // SQLite LIKE is case-insensitive for ASCII by default, so contains works correctly
  if (search?.trim()) {
    where.fullName = { contains: sanitizeSearch(search) };
  }

  const [total, data] = await Promise.all([
    prisma.employee.count({ where }),
    prisma.employee.findMany({
      where,
      orderBy: { [safeSortBy]: safeSortOrder },
      skip,
      take: limit,
    }),
  ]);

  return {
    data,
    pagination: {
      total,
      page: safePage,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getEmployeeById(id: number) {
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) {
    throw new AppError(404, `Employee with id ${id} not found`);
  }
  return employee;
}

export async function createEmployee(input: CreateEmployeeInput) {
  return prisma.employee.create({
    data: {
      fullName: input.fullName.trim().slice(0, 100),
      jobTitle: input.jobTitle.trim().slice(0, 100),
      country: input.country.trim().slice(0, 100),
      salary: input.salary,
    },
  });
}

export async function updateEmployee(id: number, input: UpdateEmployeeInput) {
  const existing = await prisma.employee.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, `Employee with id ${id} not found`);
  }
  return prisma.employee.update({ where: { id }, data: input });
}

export async function deleteEmployee(id: number) {
  const existing = await prisma.employee.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, `Employee with id ${id} not found`);
  }
  await prisma.employee.delete({ where: { id } });
}

export async function getDistinctCountries(): Promise<string[]> {
  const results = await prisma.employee.findMany({
    select: { country: true },
    distinct: ['country'],
    orderBy: { country: 'asc' },
  });
  return results.map((r) => r.country);
}

export async function getDistinctJobTitles(): Promise<string[]> {
  const results = await prisma.employee.findMany({
    select: { jobTitle: true },
    distinct: ['jobTitle'],
    orderBy: { jobTitle: 'asc' },
  });
  return results.map((r) => r.jobTitle);
}