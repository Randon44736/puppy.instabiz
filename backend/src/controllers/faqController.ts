import { Request, Response } from 'express';
import faqData from '../data/faq.json';

export const getAllFAQ = (req: Request, res: Response) => {
  const { category } = req.query;
  let results = [...faqData];

  if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
    results = results.filter((item) => item.category.toLowerCase() === category.toLowerCase());
  }

  res.json({
    success: true,
    total: results.length,
    faqs: results
  });
};
