import { Prisma } from '@prisma/client';
import prisma from './prisma';
import { AppError } from '../middleware/errorHandler';
import type { EmployeeListQuery, PaginatedResponse } from '../types';
import type { CreateEmployeeInput, UpdateEmployeeInput } from '../validators/employeeValidator';

export async function listEmployees(
  query: EmployeeListQuery,
): Promise<PaginatedResponse<Prisma.EmployeeGetPayload<object>>> {
  const { page, limit, search, country, jobTitle, sortBy = 'createdAt', sortOrder = 'desc' } = query;

  const where: Prisma.EmployeeWhereInput = {};

  if (search?.trim()) {
    where.fullName = { contains: search.trim() };
  }
  if (country) {
    where.country = country;
  }
  if (jobTitle) {
    where.jobTitle = jobTitle;
  }

  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    prisma.employee.count({ where }),
    prisma.employee.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
  ]);

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

export async function getEmployeeById(id: number) {
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) {
    throw new AppError(404, `Employee with id ${id} not found`);
  }
  return employee;
}

export async function createEmployee(input: CreateEmployeeInput) {
  return prisma.employee.create({ data: input });
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