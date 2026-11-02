import Reveal from "./reveal";

/** Shared section title: small eyebrow label, heading and supporting line. */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <Reveal
      className={`mb-10 flex flex-wrap items-end gap-4 ${center ? "justify-center text-center" : "justify-between"}`}
    >
      <div className={center ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-base leading-relaxed text-base-content/70 sm:text-lg">{subtitle}</p>}
      </div>
      {action}
    </Reveal>
  );
}
