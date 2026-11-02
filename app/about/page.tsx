import { Handshake, Lightbulb, Scale } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import StudioImage from "@/components/studio-image";

export const metadata: Metadata = { title: "About Us" };

const VALUES = [
  {
    icon: Handshake,
    title: "Creator to creator",
    text: "Studios are listed by the photographers, engineers and artists who built them, for the people who use them.",
  },
  {
    icon: Scale,
    title: "Fair, visible pricing",
    text: "Rates, cleaning fees and our 5% service fee are shown before anyone books. No hidden extras.",
  },
  {
    icon: Lightbulb,
    title: "Less admin, more making",
    text: "Live availability and one-click requests replace long message threads, so time goes into the work.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page space-y-20 py-12">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold sm:text-5xl">About StudioSpace</h1>
          <p className="mt-5 text-lg text-base-content/75">
            Many great studios sit empty for hours each day, while independent creators struggle to find a space that
            fits their shoot and their budget. StudioSpace connects the two.
          </p>
          <p className="mt-4 text-base-content/75">
            Hosts list cyc walls, sound stages, podcast lounges, recording suites and art workshops. Creators find the
            right one, see exactly which hours are open, and book by the hour. Hosts stay in control by confirming every
            request themselves.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/studios" className="btn btn-primary">
              Explore Studios
            </Link>
            <Link href="/how-it-works" className="btn btn-ghost">
              How it works
            </Link>
          </div>
        </div>
        <StudioImage
          src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
          alt="A bright, open creative studio"
          className="aspect-[4/3] w-full rounded-3xl"
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold">What we believe</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-box border border-base-300 p-6">
              <v.icon className="size-7 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-base-content/70">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
