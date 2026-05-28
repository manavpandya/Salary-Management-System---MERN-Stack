import { Router } from 'express';
import * as employeeController from '../controllers/employeeController';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeListQuerySchema,
} from '../validators/employeeValidator';

const router = Router();

router.get('/', validateQuery(employeeListQuerySchema), employeeController.listEmployees);
router.get('/countries', employeeController.getDistinctCountries);
router.get('/job-titles', employeeController.getDistinctJobTitles);
router.get('/:id', employeeController.getEmployee);
router.post('/', validateBody(createEmployeeSchema), employeeController.createEmployee);
router.put('/:id', validateBody(updateEmployeeSchema), employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

export default router;
