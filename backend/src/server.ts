import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import puppiesRoutes from './routes/puppiesRoutes';
import visitsRoutes from './routes/visitsRoutes';
import familiesRoutes from './routes/familiesRoutes';
import faqRoutes from './routes/faqRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request Logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    service: 'TeddyPups U.A.E. Backend REST API',
    showroom: 'Downtown Dubai, United Arab Emirates',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/puppies', puppiesRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/contact', visitsRoutes); // Alias
app.use('/api/families', familiesRoutes);
app.use('/api/faq', faqRoutes);

// Root fallback
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'TeddyPups U.A.E. Backend Server',
    description: 'Boutique teacup puppy REST API serving frontend and concierge integrations.',
    endpoints: [
      '/api/puppies',
      '/api/puppies/:slug',
      '/api/visits',
      '/api/families',
      '/api/faq',
      '/api/health'
    ]
  });
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found on TeddyPups backend'
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

// Start listening
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🐾 TeddyPups Backend REST API is running on http://localhost:${PORT}`);
  });
}

export default app;
