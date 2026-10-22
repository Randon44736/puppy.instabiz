import React from 'react';
import { AuthenticPageRenderer } from '../components/AuthenticPageRenderer';
import allPages from '../data/allScrapedPagesData.json';

export const HappyFamiliesPage: React.FC = () => {
  const html = (allPages as Record<string, string>)['happy-families'] || '';
  return <AuthenticPageRenderer html={html} pageId="happy-families-page" />;
};
