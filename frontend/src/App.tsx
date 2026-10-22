import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CurtainIntro } from './components/CurtainIntro';
import { PawTrailCanvas } from './components/PawTrailCanvas';
import { MobileActionBar } from './components/MobileActionBar';
import { PuppyScrollJourney } from './components/PuppyScrollJourney';

import { HomePage } from './pages/HomePage';
import { PuppiesPage } from './pages/PuppiesPage';
import { PuppyDetailPage } from './pages/PuppyDetailPage';
import { HappyFamiliesPage } from './pages/HappyFamiliesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { GoneHomePage } from './pages/GoneHomePage';

import { SmoothScroll } from './components/SmoothScroll';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <Router>
      <SmoothScroll>
        <ScrollToTop />
        <CurtainIntro />
        <div className="flex min-h-screen flex-col">
        <Header />
        <main id="main" tabIndex={-1} className="relative pt-[var(--header-h)] outline-none">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/puppies" element={<PuppiesPage />} />
            <Route path="/puppies/:slug" element={<PuppyDetailPage />} />
            <Route path="/happy-families" element={<HappyFamiliesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/gone-home" element={<GoneHomePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
          <PuppyScrollJourney />
        </main>
        <Footer />
        <MobileActionBar />
        <PawTrailCanvas />
      </div>
      </SmoothScroll>
    </Router>
  );
};

export default App;
