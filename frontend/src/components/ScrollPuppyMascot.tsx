// src/components/ScrollPuppyMascot.tsx
import React, { useEffect, useState } from 'react';

export const ScrollPuppyMascot: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = Math.min(Math.max(window.scrollY / totalScroll, 0), 1);
        setScrollProgress(progress);
      }

      setIsScrolling(true);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(timeoutId);
    };
  }, []);

  // Calculate horizontal position along the bottom viewport
  const leftPercent = 5 + scrollProgress * 85;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        bottom: '0.5rem',
        left: `${leftPercent}%`,
        transform: 'translateX(-50%)',
        zIndex: 35,
        pointerEvents: 'none',
        transition: 'left 0.15s cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Speech bubble on scroll */}
      {isScrolling && (
        <div
          className="font-scrawl"
          style={{
            backgroundColor: 'var(--color-honey)',
            color: 'var(--color-cocoa)',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            border: '1.5px solid var(--color-cocoa)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '2px',
            whiteSpace: 'nowrap'
          }}
        >
          {scrollProgress > 0.85 ? 'almost home! 🐾' : 'trotting with you! ✨'}
        </div>
      )}

      {/* Mascot Runner SVG */}
      <svg
        viewBox="0 0 100 80"
        width="44"
        height="36"
        style={{
          transform: isScrolling ? 'translateY(-2px)' : 'none',
          transition: 'transform 0.1s ease'
        }}
      >
        <ellipse cx="50" cy="74" rx="28" ry="4" fill="#2a170e" opacity="0.15" />
        {/* Puppy Body */}
        <circle cx="50" cy="45" r="22" fill="#f2be6b" stroke="#2a170e" strokeWidth="2.5" />
        {/* Puppy Head */}
        <circle cx="68" cy="34" r="16" fill="#f2be6b" stroke="#2a170e" strokeWidth="2.5" />
        {/* Ears */}
        <ellipse cx="62" cy="22" rx="5" ry="8" fill="#c2622b" stroke="#2a170e" strokeWidth="2" transform="rotate(-15 62 22)" />
        <ellipse cx="76" cy="22" rx="5" ry="8" fill="#c2622b" stroke="#2a170e" strokeWidth="2" transform="rotate(15 76 22)" />
        {/* Eyes & Snout */}
        <circle cx="66" cy="32" r="2" fill="#2a170e" />
        <circle cx="74" cy="32" r="2" fill="#2a170e" />
        <ellipse cx="70" cy="38" rx="3" ry="2" fill="#2a170e" />
        {/* Tail */}
        <path
          d="M 28 42 Q 20 32 24 24"
          fill="none"
          stroke="#f2be6b"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 28 42 Q 20 32 24 24"
          fill="none"
          stroke="#2a170e"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Legs with trot rotation */}
        <g style={{ transformOrigin: '40px 60px', transform: isScrolling ? 'rotate(12deg)' : 'none' }}>
          <rect x="37" y="58" width="6" height="14" rx="3" fill="#c2622b" stroke="#2a170e" strokeWidth="1.5" />
        </g>
        <g style={{ transformOrigin: '58px 60px', transform: isScrolling ? 'rotate(-12deg)' : 'none' }}>
          <rect x="55" y="58" width="6" height="14" rx="3" fill="#c2622b" stroke="#2a170e" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};
