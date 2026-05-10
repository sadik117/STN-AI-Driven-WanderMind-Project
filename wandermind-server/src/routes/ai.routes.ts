import { Router } from 'express';
import {
  generateItinerary, chatWithDestinationBot, generatePackingList,
  analyzeBudget, summarizeJournal
} from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';
import { aiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// All AI routes using strict rate limiting
router.post('/itinerary', aiLimiter, authenticate, generateItinerary);
router.post('/chat', aiLimiter, chatWithDestinationBot);
router.post('/packing', aiLimiter, authenticate, generatePackingList);
router.post('/budget', aiLimiter, authenticate, analyzeBudget);
router.post('/journal/summarize', aiLimiter, authenticate, summarizeJournal);

export default router;
