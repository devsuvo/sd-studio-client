# StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing

**Live site:** https://your-studiospace.vercel.app  <!-- replace with your deployed client URL -->
**API:** https://your-studiospace-api.vercel.app  <!-- replace with your deployed server URL -->

StudioSpace is a marketplace where photographers, filmmakers, podcasters, musicians and artists book creative spaces by the hour. Hosts list cyc walls, sound stages, podcast lounges, music suites and art workshops; creators search, check live hourly availability and reserve slots with transparent pricing.

## Features

- **Studio CRUD with image uploads**: add, update and delete studios (title, category, hourly rate, security deposit, capacity, address, amenities, overview). Images upload to imgbb through the API, or you can paste a URL. Host name and email are read-only and taken from your account.
- **Explore and filter**: search by keyword, category, city, price and group size, with sorting and pagination. Filters live in the URL, so results survive a reload and can be shared.
- **Studio details**: Swiper gallery carousel, full specifications, amenities, gear, host details and reviews. **Book Workspace Now** opens a booking modal with a live hour grid showing open, booked and past hours.
- **Booking system**: bookings are saved as **Pending**, then hosts confirm or decline. Past confirmed sessions become **Completed**. Creators can cancel pending bookings and download a **PDF receipt** for confirmed or completed ones.
- **Double-booking prevention**: before saving, the API checks MongoDB for any pending or confirmed booking that overlaps the requested hours, and rejects collisions with a clear message.
- **Secure auth**: BetterAuth email/password and Google login, stored in MongoDB. The API gets a JWT from an **HttpOnly cookie**, and protected routes return **401 Unauthorized** without a valid token.
- **Saved Studios wishlist**: tap the heart on any studio card to save it to MongoDB, and see your saves at `/saved`.
- **Polished, responsive UI**: light/dark theme toggle, Sonner toasts for every action, custom confirmation modals, branded loaders and skeletons, friendly empty states, and a custom 404 page.

## Pages

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Hero slider, featured studios, categories, how booking works, host guarantee |
| `/studios` | Public | Explore all studios |
| `/studios/[id]` | Public | Details, gallery, reviews, booking modal |
| `/how-it-works`, `/about`, `/terms` | Public | Info pages |
| `/login`, `/register` | Public | Auth (email/password + Google) |
| `/dashboard` | Private | Overview of bookings, listings and earnings |
| `/add-studio` | Private | Add New Studio form |
| `/my-listings` | Private | Your studios with Update / Delete |
| `/studios/edit/[id]` | Private | Update Studio form |
| `/my-bookings` | Private | Your reservations with status, cancel and PDF receipt |
| `/saved` | Private | Saved Studios wishlist |
| `/dashboard/reservations` | Private | Confirm or decline requests for your studios |

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, DaisyUI 5, Swiper.js, jsPDF, Lucide icons, Sonner |
| Auth | BetterAuth with the MongoDB adapter, Google OAuth and the JWT plugin (JWKS), stored in an HttpOnly cookie |
| Backend | Express, TypeScript, MongoDB native driver, Zod, jose, imgbb ([server repo](../server)) |
| Hosting | Vercel (client and API) + MongoDB Atlas |

## Test credentials

| Role | Email | Password |
| --- | --- | --- |
| Creator (guest) | `guest@sdstudio.dev` | `Guest@12345` |
| Studio host | `host@sdstudio.dev` | `Host@12345` |

The host owns five studios and has requests to review. The guest has pending, confirmed and completed bookings. The login page also has a **Use demo account** button.

## Local setup

1. **Prerequisites:** Node.js 20.9+ and a MongoDB connection string (local or Atlas).
2. **Install dependencies:** `cd client && npm install`
3. **Create `client/.env.local`** from `.env.example`:
   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
   DB_NAME=studiospace
   BETTER_AUTH_SECRET=<long random string>   # openssl rand -base64 32
   BETTER_AUTH_URL=http://localhost:3000
   API_URL=http://localhost:5000              # Express API; the browser reaches it through /backend
   GOOGLE_CLIENT_ID=<from Google Cloud Console>
   GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
   ```
   For Google login, create an OAuth client (Web application) and add `<BETTER_AUTH_URL>/api/auth/callback/google` as an authorized redirect URI, for both localhost and the deployed URL.
4. **Start the API** (see the server README) on port 5000 with the same `MONGODB_URI` and `DB_NAME`. Add `IMGBB_API_KEY` there to enable image uploads.
5. **Run the client:** `npm run dev`, then open http://localhost:3000.
6. **Seed demo data** (optional, with both apps running): `cd server && npm run seed`. It's safe to run more than once.

## How the JWT cookie works

1. The browser calls the API at same-origin `/backend/*`. `next.config.ts` forwards those calls to the Express API.
2. On a protected call without a token, the client asks `POST /api/session-token`. That Next.js route checks the BetterAuth session, gets a 15-minute JWT and stores it in an `HttpOnly`, `SameSite=Lax` cookie (`Secure` in production).
3. Express reads the cookie, verifies the JWT against BetterAuth's JWKS keys, and returns `401` if it's missing or invalid. Logging out or switching accounts clears the cookie.

## Deployment (Vercel)

1. Deploy the server with `MONGODB_URI`, `DB_NAME`, `CLIENT_URL` (deployed client URL) and `IMGBB_API_KEY`.
2. Deploy the client with the variables above, setting `BETTER_AUTH_URL` to the client URL and `API_URL` to the server URL.
3. In MongoDB Atlas, allow connections from Vercel (Network Access → `0.0.0.0/0`).
