import { Router } from 'express';
import { getAllPuppies, getPuppyBySlug } from '../controllers/puppiesController';

const router = Router();

router.get('/', getAllPuppies);
router.get('/:slug', getPuppyBySlug);

export default router;
