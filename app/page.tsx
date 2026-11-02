import { ArrowRight, Quote } from "lucide-react";
import Link from "next/link";
import BookingSteps from "@/components/booking-steps";
import HeroSlider from "@/components/hero-slider";
import HostGuarantee from "@/components/host-guarantee";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
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
      <section className="container-page py-20 sm:py-24">
        <SectionHeading
          eyebrow="Featured"
          title="Featured studios"
          subtitle="Top-rated spaces creators keep coming back to."
          action={
            <Link href="/studios" className="btn btn-ghost">
              View all studios <ArrowRight className="size-4" />
            </Link>
          }
        />
        <FeaturedStudios />
      </section>

      {/* Categories */}
      <section className="bg-dots border-y border-base-300/60 bg-base-200 py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Categories"
            title="Browse by studio category"
            subtitle="Every space is set up for a specific kind of work."
          />
          <CategoryGrid />
        </div>
      </section>

      {/* How booking works */}
      <section className="container-page py-20 sm:py-24">
        <SectionHeading eyebrow="Process" title="How booking works" subtitle="From search to set in four steps." center />
        <BookingSteps />
      </section>

      {/* Host guarantee & creator support */}
      <section className="bg-dots border-y border-base-300/60 bg-base-200 py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Trust & safety"
            title="Host guarantee & creator support"
            subtitle="Protection and help on both sides of every booking."
            center
          />
          <HostGuarantee />
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page py-20 sm:py-24">
        <SectionHeading eyebrow="Testimonials" title="What creators say" />
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.role} delay={i * 100} className="h-full">
              <figure className="card h-full border border-base-300 bg-base-100 p-7">
                <Quote className="size-8 text-primary/30" />
                <blockquote className="mt-3 flex-1 leading-relaxed text-base-content/85">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-base-300 pt-4 text-sm">
                  <span className="grid size-10 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
                    {t.name[0]}
                  </span>
                  <span>
                    <span className="block font-semibold">{t.name}</span>
                    <span className="block text-base-content/60">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Host CTA */}
      <Reveal as="section" className="container-page">
        <div className="relative overflow-hidden rounded-3xl bg-neutral px-6 py-16 text-neutral-content shadow-2xl sm:px-14">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-primary/35 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 size-72 rounded-full bg-secondary/25 blur-3xl" />
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
      </Reveal>
    </>
  );
}
