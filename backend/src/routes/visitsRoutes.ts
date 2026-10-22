import { Router } from 'express';
import { createVisitBooking, getAllVisits } from '../controllers/visitsController';

const router = Router();

router.post('/', createVisitBooking);
router.get('/', getAllVisits);

export default router;
