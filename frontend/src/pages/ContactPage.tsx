import React from 'react';
import { AuthenticPageRenderer } from '../components/AuthenticPageRenderer';
import allPages from '../data/allScrapedPagesData.json';

export const ContactPage: React.FC = () => {
  const html = (allPages as Record<string, string>)['contact'] || '';
  return <AuthenticPageRenderer html={html} pageId="contact-page" />;
};
