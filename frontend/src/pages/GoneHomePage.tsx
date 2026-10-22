import React from 'react';
import { AuthenticPageRenderer } from '../components/AuthenticPageRenderer';
import allPages from '../data/allScrapedPagesData.json';

export const GoneHomePage: React.FC = () => {
  const html = (allPages as Record<string, string>)['gone-home'] || '';
  return <AuthenticPageRenderer html={html} pageId="gone-home-page" />;
};
