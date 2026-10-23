---
name: motion-scrollable-website
description: Blueprint, architecture, and step-by-step implementation guide to build interactive motion graphics scrollable websites with Lenis smooth scrolling, 2D vector kinematics mascots, section milestone tracking, curtain entrance animations, and cloud CDN media pipelines. Trigger whenever the user says "build motion scrollable website" or asks for an interactive animated scroll experience.
---

# Motion Graphics Scrollable Website Architecture & Implementation Blueprint

This skill contains the complete architecture, reusable component designs, mathematical formulas, and implementation steps to build modern, high-performance motion graphics scrollable websites (identical to the TeddyPups architecture).

---

## 1. Core Architectural Pillars

1. **Smooth Kinetic Scrolling Engine (`SmoothScroll.tsx`)**:
   - Uses `@lenis/react` / `lenis` to normalize scroll behavior across trackpads, wheels, and mobile touch.
   - Respects `prefers-reduced-motion` for accessibility.
   - Provides global linear interpolation (`lerp: 0.1` or `smoothTouch: false`) for buttery 60fps scrolling without input lag.

2. **2D Vector Kinematics Animated Mascot (`AuthenticPuppyActor.tsx` / `PuppyScrollJourney.tsx`)**:
   - Built entirely with **SVG multi-part vector bones** (head, ears, torso, front legs, rear legs, tail).
   - Driven by `requestAnimationFrame` + scroll delta velocity calculations.
   - Dynamic states:
     - `Idle`: Gentle breathing oscillation (`Math.sin(time * 0.003)`).
     - `Walking / Running`: Leg and tail rotational angles calculated based on scroll speed:
       `legRotation = Math.sin(scrollProgress * 20) * maxAngle`.
     - `Obstacle Hop`: Quadratic bezier jump `yOffset = -4 * h * p * (1 - p)` when crossing designated milestone elements.
     - `Milestone Rest`: Stops and peeks into designated sections (e.g. Showroom, Our Story, FAQ) with custom facial expressions.
   - Boundary clamping: Decoupled viewport coordinates to ensure the mascot never clips off-screen on either 4K desktop or 360px mobile viewports.

3. **Authentic Curtain Entrance Animation (`CurtainIntro.tsx`)**:
   - Two vertical satin curtains (`left-curtain` and `right-curtain`) covering the screen on initial mount.
   - Splits open gracefully using CSS cubic-bezier transforms (`cubic-bezier(0.77, 0, 0.175, 1)`) after initial load.
   - Gold emblem or branding logo fades up and parts cleanly as the main hero section is revealed.

4. **Cloud CDN Asset Offloading Pipeline**:
   - Never bundle large video files or 100+ images directly inside the frontend bundle.
   - Store all high-resolution images, SVG assets, and MP4 showroom videos in **Supabase Storage** (or AWS S3/Cloudinary) under a public bucket.
   - Reference via environmental variable or centralized URL mapping: `https://<supabase-id>.supabase.co/storage/v1/object/public/<bucket>/...`.

5. **Responsive Layout & Mobile Action Lane**:
   - Desktop: Multi-column grid, rich hover cards, full mascot trajectory.
   - Mobile (< 768px):
     - Drawer navigation with hamburger toggle.
     - Touch-friendly swipeable cards or vertical stacks.
     - Sticky bottom quick action bar (e.g. WhatsApp / Phone / Book Consultation).
     - Mascot coordinates clamped strictly above the bottom bar so it never covers call-to-actions.

---

## 2. Directory Structure

```
src/
├── components/
│   ├── SmoothScroll.tsx          # Lenis smooth scroll provider
│   ├── CurtainIntro.tsx          # Grand theatrical curtain intro
│   ├── Header.tsx                # Responsive navigation & mobile drawer
│   ├── Footer.tsx                # High-fidelity footer with social links
│   ├── AuthenticPuppyActor.tsx   # 2D SVG kinematics bone actor
│   ├── PuppyScrollJourney.tsx    # Scroll tracker, milestones & bounding box sync
│   └── VideoMotionClip.tsx       # Looping 720p HD showroom video background
├── styles/
│   ├── index.css                 # Design tokens (colors, typography, glassmorphism)
│   └── animations.css            # Keyframes for pulses, hops, shimmer & ribbons
├── data/
│   └── siteData.ts               # Structured JSON for items, pricing, milestones
└── App.tsx                       # Master routing & page assembly
```

---

## 3. Step-by-Step Implementation Workflow

When the user asks to **"build motion scrollable website"**:

1. **Scaffold Project**:
   ```bash
   npm create vite@latest ./ -- --template react-ts
   npm install lenis @lenis/react lucide-react
   ```

2. **Setup Global Design System (`index.css`)**:
   - Curated color palette (rich primary, warm neutrals, luxurious accents, soft glassmorphism).
   - Premium Google Fonts (e.g. `Outfit`, `Inter`, or `Playfair Display`).
   - Smooth scroll utility classes.

3. **Install Smooth Scroll & Curtain Entrance**:
   - Wrap `<App />` inside `<SmoothScroll>`.
   - Mount `<CurtainIntro />` at root with `sessionStorage` guard so it only plays on first visit per session.

4. **Assemble the Mascot Kinematics Engine**:
   - Mount the mascot in a `fixed` position viewport overlay.
   - Listen to `window.addEventListener('scroll', handleScroll, { passive: true })`.
   - Calculate scroll percentage `p = scrollY / (docHeight - winHeight)`.
   - Map `p` to spline points or milestone section positions (`getBoundingClientRect`).

5. **Deploy & CI/CD**:
   - Configure `vercel.json` for client-side routing rewrites:
     ```json
     {
       "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
     }
     ```
   - Connect Git repository to Vercel for automated CI/CD deployments on git push.
