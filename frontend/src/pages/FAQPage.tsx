import React from 'react';
import { AuthenticPageRenderer } from '../components/AuthenticPageRenderer';
import allPages from '../data/allScrapedPagesData.json';

export const FAQPage: React.FC = () => {
  const html = (allPages as Record<string, string>)['faq'] || '';
  return <AuthenticPageRenderer html={html} pageId="faq-page" />;
};
