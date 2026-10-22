import { Request, Response } from 'express';
import rawFamiliesData from '../data/families.json';
import { getStorageUrl } from '../utils/supabaseStorage';

const familiesData = rawFamiliesData.map((f) => ({
  ...f,
  image: getStorageUrl(f.image)
}));

export const getAllFamilies = (req: Request, res: Response) => {
  const { location } = req.query;
  let results = [...familiesData];

  if (location && typeof location === 'string' && location.toLowerCase() !== 'all') {
    results = results.filter((f) => f.location.toLowerCase().includes(location.toLowerCase()));
  }

  res.json({
    success: true,
    total: results.length,
    families: results
  });
};
