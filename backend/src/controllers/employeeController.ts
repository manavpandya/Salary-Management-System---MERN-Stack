import { Request, Response, NextFunction } from 'express';
import * as employeeService from '../services/employeeService';
import type { EmployeeListQuery } from '../types';

export async function listEmployees(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = req.query as unknown as EmployeeListQuery;
    const result = await employeeService.listEmployees(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid employee id' });
      return;
    }
    const employee = await employeeService.getEmployeeById(id);
    res.json(employee);
  } catch (err) {
    next(err);
  }
}

export async function createEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
}

export async function updateEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid employee id' });
      return;
    }
    const employee = await employeeService.updateEmployee(id, req.body);
    res.json(employee);
  } catch (err) {
    next(err);
  }
}

export async function deleteEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid employee id' });
      return;
    }
    await employeeService.deleteEmployee(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getDistinctCountries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const countries = await employeeService.getDistinctCountries();
    res.json(countries);
  } catch (err) {
    next(err);
  }
}

export async function getDistinctJobTitles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const jobTitles = await employeeService.getDistinctJobTitles();
    res.json(jobTitles);
  } catch (err) {
    next(err);
  }
}
