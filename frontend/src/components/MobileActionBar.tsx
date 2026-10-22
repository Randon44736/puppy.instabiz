import React from 'react';

export const MobileActionBar: React.FC = () => {
  return (
    <div
      data-whatsapp-bar="true"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-cocoa bg-milk px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 md:hidden"
    >
      <div className="mx-auto flex max-w-md gap-2">
        <a
          className="btn btn-whatsapp !min-h-12 flex-1 !shadow-none"
          href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies."
          rel="noopener noreferrer"
          target="_blank"
        >
          WhatsApp us
        </a>
        <a
          className="btn btn-ghost !min-h-12 !px-5"
          href="tel:+971541676733"
        >
          Call
        </a>
      </div>
    </div>
  );
};
