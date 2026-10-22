// src/components/PuppyCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ShieldCheck } from 'lucide-react';
import { Puppy } from '../data/puppiesData';

interface PuppyCardProps {
  puppy: Puppy;
}

export const PuppyCard: React.FC<PuppyCardProps> = ({ puppy }) => {
  const isGirl = puppy.gender === 'Girl';
  const whatsappUrl = `https://wa.me/971541676733?text=${encodeURIComponent(
    `Hi TeddyPups! I am interested in inquiring about ${puppy.name} (${puppy.breed}, ${puppy.gender}). Is this puppy still available for a showroom visit?`
  )}`;

  return (
    <div className="tp-card">
      <Link to={`/puppies/${puppy.slug}`} className="tp-card__media">
        <img
          src={puppy.image}
          alt={puppy.name}
          className="tp-card__img"
          loading="lazy"
        />
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.4rem', zIndex: 2 }}>
          <span className="badge-tag" style={{ background: 'rgba(255, 253, 248, 0.92)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {puppy.breed}
          </span>
        </div>
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }}>
          <span className={isGirl ? 'badge-gender-girl' : 'badge-gender-boy'}>
            {puppy.gender}
          </span>
        </div>
      </Link>

      <div className="tp-card__content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
          <Link to={`/puppies/${puppy.slug}`}>
            <h3 className="font-plush" style={{ fontSize: '1.4rem', color: 'var(--color-cocoa)', fontWeight: 700 }}>
              {puppy.name}
            </h3>
          </Link>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-cocoa-soft)', fontWeight: 600 }}>
            {puppy.age}
          </span>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--color-cocoa-soft)', lineHeight: 1.5, marginBottom: '1rem', flex: 1 }}>
          {puppy.description.slice(0, 110)}...
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: 'var(--color-toffee-deep)', fontWeight: 600 }}>
          <ShieldCheck size={16} />
          <span>Vaccinated & Microchipped (UAE / ISO)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.65rem' }}>
          <Link
            to={`/puppies/${puppy.slug}`}
            className="btn btn-secondary"
            style={{ fontSize: '0.9rem', padding: '0.6rem 1rem' }}
          >
            Meet {puppy.name}
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            style={{ padding: '0.6rem 0.9rem' }}
            title="Inquire on WhatsApp"
            aria-label={`Inquire about ${puppy.name} on WhatsApp`}
          >
            <MessageCircle size={18} fill="white" />
          </a>
        </div>
      </div>
    </div>
  );
};
