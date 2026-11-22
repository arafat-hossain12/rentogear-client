# RentoGear

RentoGear is an equipment rental marketplace. Owners list construction tools, cameras, vehicles, farm machines, electronics and event gear. Customers search, book for exact dates and pay securely online. Admins approve listings and manage the platform.

**Live URL:** https://YOUR-VERCEL-URL.vercel.app
**Server repository:** https://github.com/arafat-hossain12/rentogear-server

## Features

- Three roles (customer, owner, admin) with role-based dashboards and protected routes
- Email/password and Google login with BetterAuth, plus JWT-protected API calls
- Equipment search, category / rental type / price / availability filters, sorting and pagination
- Date-based booking with live price calculation and Stripe Checkout payments
- Customer dashboard: my rentals, favorites and profile management
- Owner dashboard: analytics charts, add / update / delete equipment and rentals of my equipment
- Admin dashboard: platform analytics, user roles, equipment approval and all rentals
- Light / dark theme toggle, responsive layout, skeleton loaders and toast notifications

## Tech and packages

next, react, typescript, tailwindcss, daisyui, better-auth, mongodb, jsonwebtoken, framer-motion, react-hot-toast, react-icons, recharts

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000 (the API server must run on the URL in `NEXT_PUBLIC_API_URL`).
