# 🐾 TeddyPups U.A.E. — Luxury Teacup Puppy Boutique Web Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Storage-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Proprietary-E06A3B)]()

> A bespoke, pixel-accurate, high-fidelity luxury digital boutique created for **TeddyPups U.A.E.** — Dubai's premier boutique for pedigree teacup and micro puppies (Korean Teacup Poodles, Maltipoos, Pomeranians, and Cavapoos).

---

## 📖 About The Project

**TeddyPups U.A.E.** is an artisan digital showcase engineered to reflect the warmth, exclusivity, and charm of a luxury puppy showroom in Downtown Dubai. Built from the ground up to reproduce the original reference experience with pixel perfection, fluid 60fps animations, and a confectionary design palette.

The platform provides prospective pet parents with a comprehensive adoption journey — from discovering available puppies and viewing 720p showroom videos, to reading verified adoption stories and booking private showroom visits through an integrated concierge service.

---

## 🎯 What The Project Is Used For

### 1. Boutique Puppy Catalog & Adoption Gallery
- **Live Litter Showcase**: Browse teacup puppies filtered by breed (Maltipoo, Poodle, Pomeranian, Shih Tzu), gender, and availability status (*Available*, *Reserved*, *Adopted*).
- **Puppy Detail Pages**: High-resolution image galleries, origin certification (Korean Pedigree), microchip registration, vaccination records, expected adult weight, and 1-year genetic health guarantee.
- **Showroom Motion Clip**: Built-in 720p interactive video player showcasing puppies in their Dubai showroom environment.

### 2. Interactive Scroll Journey Engine
- **Animated Mascot ("Teddy")**: A custom 2D vector kinematics puppet walks, hops, tilts, wags, yawns, and looks at page elements as the user scrolls.
- **Dynamic Footprint Trail**: Teddy leaves behind alternating, rotated paw prints across the scene surfaces that fade naturally over 2.6 seconds.
- **Treadmill Motion Scene**: In the *"Meet the Pups"* section, Teddy hops onto a conveyor treadmill while boutique doors reveal upcoming litters in 3D perspective.
- **Basket Rest**: At the bottom of the page, Teddy smoothly hops into his woven blanket basket and sleeps.

### 3. VIP Concierge & Showroom Appointments
- **Direct WhatsApp Concierge**: Instant one-click inquiry button connecting customers with concierge specialists for private viewings and home delivery reservations.
- **Private Showroom Visit Booking**: Dedicated booking form to schedule in-person appointments at the Downtown Dubai boutique.

### 4. Community Proof & Education
- **Happy Families Wall**: Interactive polaroid grid featuring real families across Dubai Hills, Palm Jumeirah, Emirates Hills, and Arabian Ranches with their adopted puppies.
- **Adoption Guide & FAQ**: Categorized accordion answering common questions regarding international health passports, ethical breeding, grooming, and UAE-wide delivery.

---

## ☁️ Cloud Infrastructure & Media (Supabase Storage)

All high-resolution assets (227+ WebP images, vectors, brand logos, and 720p motion video) are hosted on **Supabase Cloud Storage** in a public high-speed bucket:

- **Bucket**: `puppy.instabiz`
- **CDN Base URL**: `https://wrbpnxehoumyawtdiikh.supabase.co/storage/v1/object/public/puppy.instabiz/`
- Zero local media bloat; fast global content delivery with cached WebP optimization.

---

## ✨ Key Design & Interaction Features

| Feature | Description |
| :--- | :--- |
| **Warm Confectionery Palette** | Curated tones: Milk (`#fffdf8`), Cocoa (`#2a170e`), Honey (`#f2be6b`), Toffee (`#c2622b`), Blush (`#f9cdbf`), and Sky (`#bfddf5`). |
| **Boutique Typography** | Google Fonts: `Fraunces` (luxury display serif), `Figtree` (clean geometric body), and `Shantell Sans` (whimsical handwriting). |
| **Smooth Inertial Scrolling** | Lenis smooth scroll engine with normalized velocity and seamless anchor transitions. |
| **Theatrical Curtain Entrance** | Animated draped velour curtain on first site load with scallop fringe and gold rope pull. |
| **Paw Trail Cursor** | Canvas-based mouse follower leaving soft fading paw prints as the user moves their cursor. |
| **Mobile-First Concierge Bar** | Sticky bottom action bar on mobile devices for one-tap WhatsApp chat and showroom call. |

---

## 📁 Repository Structure

```text
teddypups_fullstack/
├── frontend/                     # React 18 + Vite 6 Single Page Application
│   ├── public/                   # Static icons, brand assets, and web fonts
│   ├── src/
│   │   ├── components/           # Header, Footer, PuppyScrollJourney, VideoMotionClip, etc.
│   │   ├── data/                 # Typed puppy datasets, happy families, and FAQ data
│   │   ├── pages/                # 8 complete pages (Home, Puppies, Detail, FAQ, Contact, etc.)
│   │   ├── pup-journey/          # Kinematics puppet engine & vector bone poses
│   │   ├── services/             # Supabase storage URL resolver & API client
│   │   └── styles/               # Design tokens, CSS custom properties, and animations
│   ├── .env.example              # Environment template for Supabase
│   └── vite.config.ts
│
├── backend/                      # Node.js + Express REST API (Optional headless backend)
│   ├── src/
│   │   ├── controllers/          # Puppies, appointments, and reviews controllers
│   │   ├── routes/               # Express endpoints (/api/puppies, /api/visits, etc.)
│   │   └── server.ts             # Express server entrypoint
│   └── .env.example
│
├── scripts/
│   └── upload_to_supabase.mjs   # Automated high-concurrency Supabase asset uploader
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/Randon44736/puppy.instabiz.git
cd puppy.instabiz
```

### 2. Frontend Setup (Can Run 100% Standalone)
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Backend Setup (Optional)
```bash
cd backend
npm install
npm run dev
```
The REST API will listen on **[http://localhost:5000](http://localhost:5000)**.

---

## 🌐 Deployment

The frontend is ready for immediate 1-click deployment to **Vercel**, **Netlify**, or **Cloudflare Pages**:
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- Client-side routing rewrites are pre-configured in `frontend/vercel.json`.

---

## 📄 License
Created for **TeddyPups U.A.E.** All rights reserved.
