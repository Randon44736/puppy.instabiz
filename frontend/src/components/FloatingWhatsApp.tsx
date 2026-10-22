// src/components/FloatingWhatsApp.tsx
import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20available%20puppies."
      target="_blank"
      rel="noopener noreferrer"
      className="tp-floating-concierge"
      aria-label="Chat with TeddyPups on WhatsApp"
    >
      <MessageCircle size={22} fill="white" />
      <span>Concierge WhatsApp</span>
    </a>
  );
};
