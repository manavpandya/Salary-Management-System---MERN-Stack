import { z } from 'zod';

export const createEmployeeSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  jobTitle: z
    .string({ required_error: 'Job title is required' })
    .trim()
    .min(2, 'Job title must be at least 2 characters')
    .max(100, 'Job title must not exceed 100 characters'),
  country: z
    .string({ required_error: 'Country is required' })
    .trim()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country must not exceed 100 characters'),
  salary: z
    .number({ required_error: 'Salary is required', invalid_type_error: 'Salary must be a number' })
    .positive('Salary must be a positive number')
    .max(10_000_000, 'Salary must not exceed 10,000,000'),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const employeeListQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().positive().default(1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().int().positive().max(100).default(20)),
  search: z.string().trim().optional(),
  country: z.string().trim().optional(),
  jobTitle: z.string().trim().optional(),
  sortBy: z
    .enum(['fullName', 'jobTitle', 'country', 'salary', 'createdAt'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
