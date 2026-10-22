import { Router } from 'express';
import { getAllFamilies } from '../controllers/familiesController';

const router = Router();

router.get('/', getAllFamilies);

export default router;
