import { PrismaClient, Prisma } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import type { EmployeeListQuery, PaginatedResponse } from '../types';
import type { CreateEmployeeInput, UpdateEmployeeInput } from '../validators/employeeValidator';

const prisma = new PrismaClient();

export async function listEmployees(
  query: EmployeeListQuery,
): Promise<PaginatedResponse<Prisma.EmployeeGetPayload<object>>> {
  const { page, limit, search, country, jobTitle, sortBy = 'createdAt', sortOrder = 'desc' } = query;

  const where: Prisma.EmployeeWhereInput = {};

  if (search) {
    where.fullName = { contains: search };
  }
  if (country) {
    where.country = { equals: country };
  }
  if (jobTitle) {
    where.jobTitle = { equals: jobTitle };
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
  await getEmployeeById(id); // throws 404 if not found
  return prisma.employee.update({ where: { id }, data: input });
}

export async function deleteEmployee(id: number) {
  await getEmployeeById(id); // throws 404 if not found
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
