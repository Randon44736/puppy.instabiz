import React from 'react';
import { useParams } from 'react-router-dom';
import { AuthenticPageRenderer } from '../components/AuthenticPageRenderer';
import allPages from '../data/allScrapedPagesData.json';

export const PuppyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const pageKey = slug ? `puppies_${slug}` : 'puppies_maltipoo-max-male';
  const html = (allPages as Record<string, string>)[pageKey] || (allPages as Record<string, string>)['puppies_maltipoo-max-male'] || '';

  return <AuthenticPageRenderer html={html} pageId="puppy-detail-page" />;
};
