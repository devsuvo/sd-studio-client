import { ClipboardCheck, Upload, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import BookingSteps from "@/components/booking-steps";
import HostGuarantee from "@/components/host-guarantee";

export const metadata: Metadata = { title: "How It Works" };

const HOST_STEPS = [
  { icon: Upload, title: "List your space", text: "Add photos, gear, amenities, opening hours, a minimum booking length and your hourly rate." },
  { icon: ClipboardCheck, title: "Review requests", text: "Each request lands in your reservations inbox with the guest's details and note. Confirm or decline." },
  { icon: Wallet, title: "Fill idle hours", text: "Track upcoming sessions and confirmed earnings from your dashboard." },
];

const FAQ = [
  {
    q: "How is the price calculated?",
    a: "Hourly rate × hours, plus the host's one-off cleaning fee, plus a 5% service fee. You see the full total before you send a request.",
  },
  {
    q: "When is my slot reserved?",
    a: "As soon as you send a request, those hours are held so nobody else can book them. The host then confirms or declines.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. Cancel any pending or confirmed booking from My Bookings, and the hours are released to other creators.",
  },
  {
    q: "Can I both book and host?",
    a: "Yes. One account does both: book other studios as a creator and list your own space as a host.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container-page space-y-20 py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">How StudioSpace works</h1>
        <p className="mt-4 text-lg text-base-content/70">
          From search to wrap in four steps for creators, and three for hosts.
        </p>
      </header>

      <section>
        <h2 className="mb-6 text-2xl font-bold">For creators</h2>
        <BookingSteps />
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold">For hosts</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {HOST_STEPS.map((s, i) => (
            <div key={s.title} className="rounded-box border border-base-300 p-6">
              <s.icon className="size-7 text-secondary" />
              <h3 className="mt-4 text-lg font-semibold">
                {i + 1}. {s.title}
              </h3>
              <p className="mt-2 text-sm text-base-content/70">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold">Host guarantee & creator support</h2>
        <HostGuarantee />
      </section>

      <section className="max-w-3xl">
        <h2 className="mb-6 text-2xl font-bold">Common questions</h2>
        <div className="space-y-2">
          {FAQ.map((f, i) => (
            <div key={f.q} className="collapse collapse-plus border border-base-300">
              <input type="radio" name="faq" defaultChecked={i === 0} aria-label={f.q} />
              <div className="collapse-title font-semibold">{f.q}</div>
              <div className="collapse-content text-sm text-base-content/75">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/studios" className="btn btn-primary">
          Explore Studios
        </Link>
        <Link href="/add-studio" className="btn btn-outline">
          Host Your Space
        </Link>
      </div>
    </div>
  );
}
