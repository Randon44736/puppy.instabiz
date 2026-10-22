import React from 'react';
import { AuthenticPageRenderer } from '../components/AuthenticPageRenderer';
import allPages from '../data/allScrapedPagesData.json';

export const HomePage: React.FC = () => {
  const html = (allPages as Record<string, string>)['home'] || '';
  return <AuthenticPageRenderer html={html} pageId="home-page" />;
};
