import { Router } from 'express';
import * as insightController from '../controllers/insightController';

const router = Router();

router.get('/by-country', insightController.getSalaryByCountry);
router.get('/by-job-title', insightController.getSalaryByJobTitle);
router.get('/stats', insightController.getStats);

export default router;