import React from 'react';
import { AuthenticPageRenderer } from '../components/AuthenticPageRenderer';
import allPages from '../data/allScrapedPagesData.json';

export const PuppiesPage: React.FC = () => {
  const html = (allPages as Record<string, string>)['puppies'] || '';
  return <AuthenticPageRenderer html={html} pageId="puppies-page" />;
};
