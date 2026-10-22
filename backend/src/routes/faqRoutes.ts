import { Router } from 'express';
import { getAllFAQ } from '../controllers/faqController';

const router = Router();

router.get('/', getAllFAQ);

export default router;
