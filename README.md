# TeddyPups U.A.E. — Fullstack Application (Frontend & Backend)

> Recreating [TeddyPups U.A.E.](https://puppy.instabizweb.com/) as a fullstack architecture with separated **React + Vite Frontend** and **Express REST API Backend**.

---

## 📁 Project Structure

```text
teddypups_fullstack/
├── backend/                  # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── controllers/      # Route controllers (puppies, visits, families, FAQ)
│   │   ├── routes/           # Express router endpoints (/api/puppies, /api/visits, etc.)
│   │   ├── data/             # Structured JSON data (puppies, families, FAQ)
│   │   └── server.ts         # Main Express entrypoint (CORS, logging, error handling)
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                 # React 18 + Vite 6 + TypeScript 5 SPA
│   ├── public/
│   │   ├── brand/            # Official brand logos & favicons
│   │   ├── fonts/            # WOFF2 typography resources
│   │   ├── images/           # 219 high-resolution WebP puppy photos
│   │   └── media/            # 720p showroom puppy motion video & poster
│   ├── src/
│   │   ├── components/       # Header, Footer, PuppyCard, VideoMotionClip, Mascot
│   │   ├── data/             # Typed datasets
│   │   ├── pages/            # 8 complete pages (Home, Puppies, Detail, etc.)
│   │   ├── services/         # API service connecting React to Express backend
│   │   ├── styles/           # Extracted design system & CSS custom properties
│   │   ├── App.tsx           # React Router route definitions
│   │   └── main.tsx          # React DOM root mounting
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vercel.json           # Client-side routing rewrites for deployment
│   └── vite.config.ts
└── README.md
```

---

## 🚀 Running the Project

### 1. Start the Backend API (Port 5000)
```bash
cd backend
npm install
npm run dev
```
The REST API will start at [http://localhost:5000](http://localhost:5000).

#### Available Endpoints:
- `GET  /api/health` — Server health status and showroom location
- `GET  /api/puppies` — List all puppies (supports `?breed=...`, `?gender=...`, `?search=...`)
- `GET  /api/puppies/:slug` — Individual puppy details & related litters
- `POST /api/visits` — Book private showroom appointment (with field validation)
- `GET  /api/visits` — List all registered appointments
- `GET  /api/families` — Customer adoption gallery (supports `?location=...`)
- `GET  /api/faq` — Categorized adoption FAQ items

### 2. Start the Frontend Application (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the clone with live motion video, animations, and backend connectivity!

---

## 🎨 Visual Fidelity & Design System
- **Colors**: Confectionery warm palette (`--color-milk: #fffdf8`, `--color-cocoa: #2a170e`, `--color-honey: #f2be6b`, `--color-toffee: #c2622b`, `--color-blush: #f9cdbf`, `--color-sky: #bfddf5`).
- **Typography**: `Fraunces` (plush serif display), `Figtree` (clean geometric body), `Shantell Sans` (handwritten cursive).
- **Motion & Video**: Authentic 720p showroom puppy motion video clip with interactive controls (`.tp-clip`) and scroll-driven mascot trotting animation.

# puppy.instabiz
