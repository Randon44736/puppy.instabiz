import { Request, Response } from 'express';
import rawPuppiesData from '../data/puppies.json';
import { getStorageUrl } from '../utils/supabaseStorage';

const puppiesData = rawPuppiesData.map((p) => ({
  ...p,
  image: getStorageUrl(p.image),
  gallery: Array.isArray(p.gallery) ? p.gallery.map(getStorageUrl) : []
}));

export const getAllPuppies = (req: Request, res: Response) => {
  const { breed, gender, search } = req.query;
  let results = [...puppiesData];

  if (breed && typeof breed === 'string' && breed.toLowerCase() !== 'all') {
    results = results.filter((p) => p.breed.toLowerCase().includes(breed.toLowerCase()));
  }

  if (gender && typeof gender === 'string' && gender.toLowerCase() !== 'all') {
    results = results.filter((p) => p.gender.toLowerCase() === gender.toLowerCase() || p.gender === 'Boy & Girl');
  }

  if (search && typeof search === 'string') {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.breed.toLowerCase().includes(q) ||
        p.fullTitle.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: results.length,
    puppies: results
  });
};

export const getPuppyBySlug = (req: Request, res: Response) => {
  const { slug } = req.params;
  const puppy = puppiesData.find((p) => p.slug === slug || p.id === slug);

  if (!puppy) {
    return res.status(404).json({
      success: false,
      message: `Puppy with slug '${slug}' not found`
    });
  }

  // Related puppies
  const related = puppiesData
    .filter((p) => p.id !== puppy.id && p.breed === puppy.breed)
    .slice(0, 3);

  res.json({
    success: true,
    puppy,
    related
  });
};
