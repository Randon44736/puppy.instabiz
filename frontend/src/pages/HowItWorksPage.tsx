import React from 'react';
import { AuthenticPageRenderer } from '../components/AuthenticPageRenderer';
import allPages from '../data/allScrapedPagesData.json';

export const HowItWorksPage: React.FC = () => {
  const html = (allPages as Record<string, string>)['how-it-works'] || '';
  return <AuthenticPageRenderer html={html} pageId="how-it-works-page" />;
};
