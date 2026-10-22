import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import authenticHtml from '../data/authenticHtmlData.json';

type CurtainState = 'intro' | 'covering' | 'covered' | 'lifting' | 'idle';

export const CurtainIntro: React.FC = () => {
  const [curtainState, setCurtainState] = useState<CurtainState>('intro');
  const location = useLocation();
  const currentPathRef = useRef(location.pathname);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = () => {
    timers.current.forEach(t => clearTimeout(t));
    timers.current = [];
  };

  // 1. Initial page load / browser refresh: run the authentic intro splash once
  useEffect(() => {
    setCurtainState('intro');

    // The authentic CSS animation 'tp-curtain-lift' starts at 0.56s and completes at 1.04s
    const t = setTimeout(() => {
      setCurtainState('idle');
    }, 1150);
    timers.current.push(t);

    return () => clearAllTimers();
  }, []);

  // 2. On actual route change (navigating to another page)
  useEffect(() => {
    // Only trigger if the pathname has genuinely changed
    if (currentPathRef.current === location.pathname) {
      return;
    }
    currentPathRef.current = location.pathname;

    clearAllTimers();

    // 1) Cover: blanket sweeps up from bottom (0.3s)
    setCurtainState('covering');

    // 2) Covered: blanket stays in place while page view resets to top
    const t1 = setTimeout(() => {
      setCurtainState('covered');
      window.scrollTo(0, 0);
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }
    }, 300);

    // 3) Lifting: blanket lifts off toward the top (0.46s)
    const t2 = setTimeout(() => {
      setCurtainState('lifting');
    }, 380);

    // 4) Idle: curtain becomes hidden
    const t3 = setTimeout(() => {
      setCurtainState('idle');
    }, 880);

    timers.current.push(t1, t2, t3);

    return () => clearAllTimers();
  }, [location.pathname]);

  const handleDismiss = () => {
    clearAllTimers();
    setCurtainState('idle');
  };

  const rawHtml = authenticHtml.curtain || '';
  const html = rawHtml.replace('data-state="idle"', `data-state="${curtainState}"`);

  return (
    <div
      onClick={handleDismiss}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
