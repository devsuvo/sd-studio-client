import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

const SECTIONS = [
  {
    title: "1. Accounts",
    text: "You need an account to book or host. Keep your login details private; you're responsible for activity on your account.",
  },
  {
    title: "2. Bookings",
    text: "A booking request holds the selected hours until the host confirms or declines it. Prices shown at request time (hourly rate, cleaning fee and 5% service fee) are the prices that apply.",
  },
  {
    title: "3. Cancellations",
    text: "Guests may cancel pending or confirmed bookings from their dashboard. Hosts may decline requests or cancel confirmed bookings, and should give guests as much notice as possible.",
  },
  {
    title: "4. Hosting",
    text: "Hosts must describe their space, equipment and rules accurately and keep the studio safe for the number of people listed.",
  },
  {
    title: "5. Using the space",
    text: "Guests must follow each studio's house rules, look after equipment, and leave the space as they found it.",
  },
  {
    title: "6. Changes",
    text: "We may update these terms as the platform grows. Continued use after an update means you accept the new terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Terms of Service</h1>
      <p className="mt-3 text-base-content/70">The short version of how StudioSpace works for hosts and creators.</p>
      <div className="mt-10 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-semibold">{s.title}</h2>
            <p className="mt-2 text-base-content/80">{s.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
