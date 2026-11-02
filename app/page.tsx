import { CalendarCheck, Search, ShieldCheck, Sparkles, Upload, Wallet, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import StudioImage from "@/components/studio-image";
import { CategoryGrid, FeaturedStudios, HeroSearch, StatsStrip } from "./home-sections";

const GUEST_STEPS = [
  { icon: Search, title: "Find your space", text: "Filter by category, city, budget and crew size to shortlist studios that fit the shoot." },
  { icon: CalendarCheck, title: "Pick open hours", text: "See booked hours for any date, choose a start and end time, and check the full price." },
  { icon: Sparkles, title: "Create", text: "Your host confirms the request and you show up to a space that's ready to go." },
];

const HOST_STEPS = [
  { icon: Upload, title: "List in minutes", text: "Add photos, gear, opening hours and an hourly rate. Your listing goes live right away." },
  { icon: ClipboardCheck, title: "Approve requests", text: "Every request lands in your reservations inbox. Confirm or decline in one click." },
  { icon: Wallet, title: "Earn from idle hours", text: "Track confirmed earnings from your dashboard and keep your calendar full." },
];

const TESTIMONIALS = [
  {
    quote:
      "The availability view saved us a dozen back-and-forth messages. We could see the open hours and lock in a slot in under five minutes.",
    name: "Podcast producer",
    role: "Weekly interview show, Dhaka",
  },
  {
    quote:
      "Our cyc wall used to sit empty on weekdays. Listing it here filled most of those mornings within the first month.",
    name: "Studio owner",
    role: "Photography loft host",
  },
  {
    quote:
      "Price breakdowns are clear before you book: hourly rate, cleaning, service fee. No surprises when the invoice arrives.",
    name: "Freelance photographer",
    role: "Product and fashion work",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute -left-32 -top-32 -z-10 size-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-40 right-0 -z-10 size-96 rounded-full bg-secondary/15 blur-3xl" />
        <div className="container-page grid items-center gap-12 py-14 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <span className="badge badge-primary badge-soft gap-1">
              <ShieldCheck className="size-3.5" /> Hosts confirm every booking
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              Book the room your next project <span className="text-primary">deserves</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-base-content/75">
              Cyc walls, sound stages, podcast lounges, recording suites and art workshops, rented by the hour from
              the creators who built them.
            </p>
            <HeroSearch />
          </div>
          <div className="relative hidden h-[460px] lg:block">
            <StudioImage
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80"
              alt="Photographer's camera in a studio"
              className="absolute right-0 top-0 h-[78%] w-[72%] rounded-3xl shadow-2xl"
            />
            <StudioImage
              src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=700&q=80"
              alt="Podcast microphone"
              className="absolute bottom-0 left-0 h-[52%] w-[50%] rounded-3xl border-8 border-base-100 shadow-2xl"
            />
            <div className="absolute bottom-10 right-4 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-xl">
              <p className="text-xs text-base-content/60">Pay only for the hours you use</p>
              <p className="font-semibold">Rate + cleaning + 5% fee, shown upfront</p>
            </div>
          </div>
        </div>
      </section>

      <StatsStrip />

      {/* Categories */}
      <section className="container-page py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Browse by craft</h2>
            <p className="mt-2 text-base-content/70">Every space is set up for a specific kind of work.</p>
          </div>
          <Link href="/studios" className="btn btn-ghost">
            View all studios →
          </Link>
        </div>
        <CategoryGrid />
      </section>

      {/* Featured */}
      <section className="bg-base-200 py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold">Top rated studios</h2>
          <p className="mt-2 text-base-content/70">Spaces creators keep coming back to.</p>
          <FeaturedStudios />
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16">
        <h2 className="text-center text-3xl font-bold">How SD Studio works</h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {[
            { heading: "For creators", steps: GUEST_STEPS, tone: "text-primary bg-primary/10" },
            { heading: "For hosts", steps: HOST_STEPS, tone: "text-secondary bg-secondary/10" },
          ].map((group) => (
            <div key={group.heading} className="rounded-box border border-base-300 p-6 sm:p-8">
              <h3 className="text-xl font-semibold">{group.heading}</h3>
              <ol className="mt-6 space-y-6">
                {group.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${group.tone}`}>
                      <s.icon className="size-5" />
                    </span>
                    <div>
                      <p className="font-semibold">
                        {i + 1}. {s.title}
                      </p>
                      <p className="mt-1 text-sm text-base-content/70">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page pb-16">
        <h2 className="text-3xl font-bold">What creators say</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.role} className="card border border-base-300 bg-base-100 p-6">
              <blockquote className="text-base-content/85">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="block text-base-content/60">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Host CTA */}
      <section className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-neutral px-6 py-14 text-neutral-content sm:px-12">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">Have a studio that sits empty between sessions?</h2>
            <p className="mt-4 text-neutral-content/80">
              List it in a few minutes, set your own hours and rate, and approve each request yourself.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard/listings/new" className="btn btn-primary">
                List your studio
              </Link>
              <Link href="/studios" className="btn btn-outline border-neutral-content/40 text-neutral-content">
                See other listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
