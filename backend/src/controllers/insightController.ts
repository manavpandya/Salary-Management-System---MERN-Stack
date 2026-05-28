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
    const insights = await insightService.getSalaryInsightsByJobTitle(country);
    res.json(insights);
  } catch (err) {
    next(err);
  }
}
