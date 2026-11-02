# StudioSpace — Peer-to-Peer Creative Workspace & Studio Booking

**Live site:** https://your-sd-studio.vercel.app  <!-- replace with your deployed client URL -->
**API:** https://your-sd-studio-api.vercel.app  <!-- replace with your deployed server URL -->

StudioSpace is a marketplace where photographers, filmmakers, podcasters, musicians and artists book creative spaces by the hour. Studio owners list cyc walls, sound stages, podcast lounges, recording suites and art workshops; creators search, check live hourly availability and send booking requests that hosts confirm or decline.

## Features

- **Search and filter studios** by keyword, category, city, hourly rate and group size, with sorting and pagination. Every filter lives in the URL, so results can be shared and survive a reload.
- **Live hourly availability**: pick a date and see which hours are booked, already past or open, then choose a start and end time from an hour grid. The server rejects overlapping bookings.
- **Transparent pricing**: hourly subtotal, cleaning fee and a 5% service fee are shown before you send a request, and the server calculates the same total.
- **Host tools**: list a studio (photos, gear, amenities, opening hours, minimum booking length), edit or delete it, and confirm or decline incoming requests from a reservations inbox.
- **Creator dashboard**: upcoming, past and cancelled bookings, one-click cancellation, and a summary of sessions, spend, listings and earnings.
- **Interactive home page**: a Swiper.js hero slider, six top-rated studios loaded from MongoDB, category cards that open a pre-filtered search, a four-step booking guide, and host guarantee and creator support sections.
- **Secure auth**: BetterAuth email/password and Google sign-in, with sessions stored in MongoDB. Passwords need an uppercase letter, a lowercase letter and at least 6 characters. The client gets short-lived JWTs that the Express API verifies against BetterAuth's JWKS endpoint.
- **Reload-safe private routes**: a proxy cookie check plus a session-aware guard means logged-in users stay on private pages after a reload instead of being sent to login.
- **Polished UX**: Sonner toasts for every success and error, custom confirmation modals (no browser alerts), light and dark themes, skeleton loaders and a responsive layout.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, DaisyUI 5, Swiper.js, Lucide icons, Sonner |
| Auth | BetterAuth with the MongoDB adapter, Google OAuth and the JWT plugin (JWKS) |
| Backend | Express, TypeScript, MongoDB native driver, Zod, jose ([server repo](../server)) |
| Hosting | Vercel (client and API) + MongoDB Atlas |

## Test credentials

| Role | Email | Password |
| --- | --- | --- |
| Creator (guest) | `guest@sdstudio.dev` | `Guest@12345` |
| Studio host | `host@sdstudio.dev` | `Host@12345` |

The host account owns several studios and has pending requests to review. The guest account has bookings to view and cancel. The login page also has a **Use demo account** button.

## Local setup

1. **Prerequisites:** Node.js 20.9+ and a MongoDB connection string (local MongoDB or Atlas).
2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```
3. **Create `client/.env.local`** from `.env.example`:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
   DB_NAME=studiospace
   BETTER_AUTH_SECRET=<long random string>   # openssl rand -base64 32
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:5000
   GOOGLE_CLIENT_ID=<from Google Cloud Console>
   GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
   ```
   For Google sign-in, create an OAuth client (type: Web application) and add `<BETTER_AUTH_URL>/api/auth/callback/google` as an authorized redirect URI. Do this for both localhost and your deployed URL.
4. **Start the API** (see the server README) on port 5000, using the same `MONGODB_URI` and `DB_NAME`.
5. **Run the client**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.
6. **Seed demo data** (optional, with both apps running): `cd server && npm run seed`. This creates the test accounts above plus sample studios and bookings.

## Deployment (Vercel)

1. Deploy the client and set the environment variables above. `BETTER_AUTH_URL` must be the deployed client URL and `NEXT_PUBLIC_API_URL` the deployed API URL.
2. Deploy the server with `CLIENT_URL` set to the deployed client URL. The API uses it for CORS and to fetch BetterAuth's JWKS keys.
3. In MongoDB Atlas, allow connections from Vercel (Network Access → `0.0.0.0/0`, or Vercel's IP ranges).

## Project structure

```
app/
  page.tsx                 Landing page
  studios/                 Explore page and studio details + booking panel
  login/, register/        Auth pages
  dashboard/               Private area: overview, bookings, listings, reservations
  api/auth/[...all]/       BetterAuth route handler
components/                Navbar, footer, cards, forms, confirm modal, auth guard
lib/                       BetterAuth config, API client, types, formatting
proxy.ts                   Redirects signed-out visitors away from /dashboard
```
