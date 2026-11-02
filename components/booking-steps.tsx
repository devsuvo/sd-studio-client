import { CalendarClock, Clapperboard, Search, Zap } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Discover Spaces", text: "Search by craft, city, budget and crew size, then compare photos, gear and house rules." },
  { icon: CalendarClock, title: "Select Shoot Hours", text: "Pick a date and see open and booked hours, then choose your start and end time." },
  { icon: Zap, title: "Book Instantly", text: "See the full price upfront and send your request in one click. Your slot is held right away." },
  { icon: Clapperboard, title: "Create & Produce", text: "Arrive to a ready studio once the host confirms, and focus on the work." },
];

export default function BookingSteps() {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((s, i) => (
        <li key={s.title} className="relative rounded-box border border-base-300 bg-base-100 p-6">
          <span className="absolute right-5 top-4 font-display text-5xl font-bold text-base-content/10">{i + 1}</span>
          <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <s.icon className="size-6" />
          </span>
          <h3 className="mt-4 text-lg font-semibold">
            {i + 1}. {s.title}
          </h3>
          <p className="mt-2 text-sm text-base-content/70">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
