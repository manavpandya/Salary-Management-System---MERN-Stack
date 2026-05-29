import { Request, Response, NextFunction } from 'express';
import * as insightService from '../services/insightService';

export async function getSalaryByCountry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const insights = await insightService.getSalaryInsightsByCountry();
    res.json(insights);
  } catch (err) {
    next(err);
  }
}

export async function getSalaryByJobTitle(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const country = req.query.country as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
    const result = await insightService.getSalaryInsightsByJobTitle(country, page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await insightService.getTotalSalaryStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}