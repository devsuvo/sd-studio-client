import { BadgeCheck, Headset, ShieldCheck, Wrench } from "lucide-react";
import Reveal from "./reveal";

const ASSURANCES = [
  {
    icon: ShieldCheck,
    title: "Liability protection",
    text: "Every confirmed booking carries clear house rules and a written record of who booked, when and for how long, so both sides know where they stand.",
  },
  {
    icon: BadgeCheck,
    title: "Verified profiles",
    text: "Hosts and creators sign in with a verified email or Google account, and every request shows who is asking before a host confirms.",
  },
  {
    icon: Wrench,
    title: "Equipment safety",
    text: "Hosts list the exact gear included and the rules for using it, so kits are handled properly and arrive back where they belong.",
  },
  {
    icon: Headset,
    title: "24/7 host support",
    text: "Something wrong with a booking at 2 AM? Our support team is on hand around the clock for hosts and creators.",
  },
];

export default function HostGuarantee() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {ASSURANCES.map((a, i) => (
        <Reveal key={a.title} delay={(i % 2) * 90} className="flex h-full gap-5 rounded-box border border-base-300 bg-base-100 p-7 transition duration-300 hover:-translate-y-1 hover:border-secondary/50">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 text-secondary-content shadow-lg shadow-secondary/25">
            <a.icon className="size-6" />
          </span>
          <div>
            <h3 className="text-lg font-semibold">{a.title}</h3>
            <p className="mt-1 text-sm text-base-content/70">{a.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
