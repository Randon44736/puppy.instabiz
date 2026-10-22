import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import authenticHtml from '../data/authenticHtmlData.json';

export const Footer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Allow external links, WhatsApp, email, tel, and social media to open normally
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('//')
      ) {
        return;
      }

      // Handle internal SPA navigation
      if (href.startsWith('/')) {
        e.preventDefault();

        if (href.includes('#')) {
          const [path, hash] = href.split('#');
          navigate(path || '/');
          setTimeout(() => {
            const el = document.getElementById(hash) || document.querySelector(`[name="${hash}"]`);
            if (el) {
              const lenis = (window as any).lenis;
              if (lenis) {
                lenis.scrollTo(el);
              } else {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }, 150);
        } else {
          navigate(href);
          const lenis = (window as any).lenis;
          if (lenis) {
            lenis.scrollTo(0, { immediate: true });
          } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }
        }
      }
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [navigate]);

  return (
    <div
      ref={containerRef}
      className="tp-footer-root"
      dangerouslySetInnerHTML={{ __html: authenticHtml.footer }}
    />
  );
};

