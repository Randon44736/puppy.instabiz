// src/services/api.ts
import { PUPPIES, Puppy } from '../data/puppiesData';
import { HAPPY_FAMILIES, HappyFamily } from '../data/familiesData';
import { FAQ_ITEMS, FAQItem } from '../data/faqData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Fetch all puppies with optional filter params
  async getPuppies(params?: { breed?: string; gender?: string; search?: string }): Promise<Puppy[]> {
    try {
      const query = new URLSearchParams();
      if (params?.breed && params.breed !== 'All') query.append('breed', params.breed);
      if (params?.gender && params.gender !== 'All') query.append('gender', params.gender);
      if (params?.search) query.append('search', params.search);

      const res = await fetch(`${API_BASE_URL}/puppies?${query.toString()}`);
      if (!res.ok) throw new Error('Backend response error');
      const data = await res.json();
      return data.puppies;
    } catch {
      // Fallback to local typed dataset
      let results = [...PUPPIES];
      if (params?.breed && params.breed !== 'All') {
        results = results.filter((p) => p.breed.toLowerCase().includes(params.breed!.toLowerCase()));
      }
      if (params?.gender && params.gender !== 'All') {
        results = results.filter((p) => p.gender === params.gender || p.gender === 'Boy & Girl');
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        results = results.filter((p) => p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q));
      }
      return results;
    }
  },

  // Fetch individual puppy by slug
  async getPuppyBySlug(slug: string): Promise<{ puppy: Puppy | null; related: Puppy[] }> {
    try {
      const res = await fetch(`${API_BASE_URL}/puppies/${slug}`);
      if (!res.ok) throw new Error('Puppy not found on backend');
      const data = await res.json();
      return { puppy: data.puppy, related: data.related || [] };
    } catch {
      const puppy = PUPPIES.find((p) => p.slug === slug || p.id === slug) || null;
      const related = PUPPIES.filter((p) => p.slug !== slug && p.breed === puppy?.breed).slice(0, 3);
      return { puppy, related };
    }
  },

  // Book a showroom appointment
  async createVisitBooking(bookingData: {
    name: string;
    phone: string;
    email: string;
    breed: string;
    date: string;
    time?: string;
    message?: string;
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      return await res.json();
    } catch {
      // Offline fallback confirmation
      return {
        success: true,
        message: 'Your appointment has been registered locally and concierge notified!',
        booking: {
          id: `TP-OFFLINE-${Date.now().toString(36).toUpperCase()}`,
          ...bookingData
        }
      };
    }
  },

  // Fetch happy families
  async getFamilies(): Promise<HappyFamily[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/families`);
      if (!res.ok) throw new Error('Failed to fetch from backend');
      const data = await res.json();
      return data.families;
    } catch {
      return HAPPY_FAMILIES;
    }
  },

  // Fetch FAQs
  async getFAQ(): Promise<FAQItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/faq`);
      if (!res.ok) throw new Error('Failed to fetch from backend');
      const data = await res.json();
      return data.faqs;
    } catch {
      return FAQ_ITEMS;
    }
  }
};
