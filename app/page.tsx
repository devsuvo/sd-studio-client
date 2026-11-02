import Link from "next/link";
import BookingSteps from "@/components/booking-steps";
import HeroSlider from "@/components/hero-slider";
import HostGuarantee from "@/components/host-guarantee";
import { CategoryGrid, FeaturedStudios, StatsStrip } from "./home-sections";

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
      <HeroSlider />
      <StatsStrip />

      {/* Featured studios (top rated, limit 6) */}
      <section className="container-page py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Featured studios</h2>
            <p className="mt-2 text-base-content/70">Top-rated spaces creators keep coming back to.</p>
          </div>
          <Link href="/studios" className="btn btn-ghost">
            View all studios →
          </Link>
        </div>
        <FeaturedStudios />
      </section>

      {/* Categories */}
      <section className="bg-base-200 py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold">Browse by studio category</h2>
          <p className="mt-2 text-base-content/70">Every space is set up for a specific kind of work.</p>
          <CategoryGrid />
        </div>
      </section>

      {/* How booking works */}
      <section className="container-page py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">How booking works</h2>
          <p className="mt-2 text-base-content/70">From search to set in four steps.</p>
        </div>
        <BookingSteps />
      </section>

      {/* Host guarantee & creator support */}
      <section className="bg-base-200 py-16">
        <div className="container-page">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">Host guarantee & creator support</h2>
            <p className="mt-2 text-base-content/70">Protection and help on both sides of every booking.</p>
          </div>
          <HostGuarantee />
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page py-16">
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
              <Link href="/add-studio" className="btn btn-primary">
                Host Your Space
              </Link>
              <Link href="/studios" className="btn btn-outline border-neutral-content/40 text-neutral-content">
                Explore Studios
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
