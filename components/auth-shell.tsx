import StudioImage from "./studio-image";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-page grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
      <div className="relative hidden h-[560px] overflow-hidden rounded-3xl lg:block">
        <StudioImage
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"
          alt="A recording studio control room"
          className="absolute inset-0 size-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral/90 via-neutral/30 to-transparent" />
        <blockquote className="absolute inset-x-8 bottom-8 text-neutral-content">
          <p className="font-display text-2xl font-semibold leading-snug">
            “We booked a sound stage on Tuesday and wrapped our music video by Friday.”
          </p>
          <footer className="mt-3 text-sm opacity-80">Director, independent music video crew</footer>
        </blockquote>
      </div>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-base-content/70">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
