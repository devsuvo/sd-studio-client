"use client";

import {
  ArrowLeft,
  CalendarPlus,
  Check,
  Clock,
  Mail,
  MapPin,
  Maximize,
  Pencil,
  ScrollText,
  ShieldCheck,
  Star,
  Users,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ErrorState, Spinner } from "@/components/ui";
import UserAvatar from "@/components/user-avatar";
import { HeartButton } from "@/components/wishlist";
import { useFetch } from "@/hooks/use-fetch";
import { useSession } from "@/lib/auth-client";
import { formatHour, formatMoney } from "@/lib/format";
import type { Studio } from "@/lib/types";
import BookingPanel from "./booking-panel";
import Gallery from "./gallery";
import Reviews from "./reviews";

export default function StudioDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: studio, error, loading, reload } = useFetch<Studio>(`/api/studios/${id}`);
  const modalRef = useRef<HTMLDialogElement>(null);
  // Mount the panel only while the modal is open, so it fetches fresh availability every time.
  const [bookingOpen, setBookingOpen] = useState(false);

  if (loading) return <Spinner label="Loading studio" />;
  if (error || !studio) {
    return (
      <div className="container-page space-y-4 py-16">
        <ErrorState message={error ?? "This studio couldn't be loaded."} onRetry={reload} />
        <Link href="/studios" className="btn btn-ghost">
          <ArrowLeft className="size-4" /> Back to all studios
        </Link>
      </div>
    );
  }

  const isOwner = session?.user.email === studio.ownerEmail;

  const openBooking = () => {
    if (!session) {
      toast.info("Log in to book this workspace.");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setBookingOpen(true);
    modalRef.current?.showModal();
  };
  const closeBooking = () => modalRef.current?.close();

  const specs = [
    { icon: Maximize, label: "Size", value: `${studio.sizeSqft.toLocaleString()} sq ft` },
    { icon: Users, label: "Max capacity", value: `${studio.capacity} people` },
    { icon: Clock, label: "Open hours", value: `${formatHour(studio.openHour)} – ${formatHour(studio.closeHour)}` },
    { icon: Clock, label: "Minimum booking", value: `${studio.minHours} hour${studio.minHours > 1 ? "s" : ""}` },
    { icon: ShieldCheck, label: "Security deposit", value: `${formatMoney(studio.securityDeposit ?? 0)} (refundable)` },
  ];

  return (
    <div className="container-page py-8">
      <Link href="/studios" className="btn btn-ghost btn-sm -ml-3 mb-4">
        <ArrowLeft className="size-4" /> All studios
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="badge badge-primary badge-soft">{studio.category}</span>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{studio.title}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-base-content/70">
            <span className="flex items-center gap-1">
              <MapPin className="size-4" /> {studio.address}, {studio.city}
            </span>
            <span className="flex items-center gap-1">
              <Star className="size-4 fill-warning text-warning" />
              {studio.reviewCount > 0 ? `${studio.rating.toFixed(1)} (${studio.reviewCount} reviews)` : "New listing"}
            </span>
          </p>
        </div>
        <HeartButton studioId={studio._id} title={studio.title} className="btn-md" />
      </div>

      <div className="mt-6">
        <Gallery images={studio.images} title={studio.title} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-10">
          <section>
            <h2 className="text-xl font-semibold">Workspace specifications</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              {specs.map((s) => (
                <div key={s.label} className="rounded-box border border-base-300 p-4">
                  <s.icon className="size-5 text-primary" />
                  <p className="mt-2 text-xs text-base-content/60">{s.label}</p>
                  <p className="text-sm font-semibold">{s.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-base-content/80">{studio.description}</p>
          </section>

          {studio.amenities.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">Amenities</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {studio.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-base-content/80">
                    <Check className="size-4 text-success" /> {a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {studio.equipment.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">Equipment included</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {studio.equipment.map((e) => (
                  <span key={e} className="badge badge-lg badge-outline gap-1">
                    <Wrench className="size-3" /> {e}
                  </span>
                ))}
              </div>
            </section>
          )}

          {studio.rules && (
            <section>
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <ScrollText className="size-5" /> House rules
              </h2>
              <p className="mt-3 whitespace-pre-line text-base-content/80">{studio.rules}</p>
            </section>
          )}

          <section>
            <h2 className="text-xl font-semibold">Your host</h2>
            <div className="mt-4 flex items-center gap-4 rounded-box border border-base-300 p-5">
              <UserAvatar name={studio.ownerName} size="size-14" />
              <div className="min-w-0">
                <p className="font-semibold">{studio.ownerName}</p>
                <a href={`mailto:${studio.ownerEmail}`} className="link link-hover flex items-center gap-1 text-sm">
                  <Mail className="size-3.5" /> {studio.ownerEmail}
                </a>
              </div>
            </div>
          </section>

          <Reviews studio={studio} onChange={reload} />
        </div>

        {/* Booking summary */}
        <aside>
          <div className="sticky top-24 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
            <p>
              <span className="text-3xl font-bold">{formatMoney(studio.hourlyRate)}</span>
              <span className="text-base-content/60"> / hr</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-base-content/75">
              <li className="flex justify-between">
                <span>Minimum booking</span>
                <span className="font-medium text-base-content">
                  {studio.minHours} hour{studio.minHours > 1 ? "s" : ""}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Security deposit</span>
                <span className="font-medium text-base-content">{formatMoney(studio.securityDeposit ?? 0)}</span>
              </li>
              <li className="flex justify-between">
                <span>Service fee</span>
                <span className="font-medium text-base-content">5%</span>
              </li>
            </ul>
            {isOwner ? (
              <div className="mt-6 space-y-2">
                <p className="text-sm text-base-content/70">This is your studio.</p>
                <Link href={`/studios/edit/${studio._id}`} className="btn btn-primary w-full">
                  <Pencil className="size-4" /> Update Studio
                </Link>
                <Link href="/dashboard/reservations" className="btn btn-outline w-full">
                  View reservations
                </Link>
              </div>
            ) : (
              <button className="btn btn-primary btn-lg mt-6 w-full" onClick={openBooking}>
                <CalendarPlus className="size-5" /> Book Workspace Now
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* Booking modal */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle" onClose={() => setBookingOpen(false)}>
        <div className="modal-box max-h-[92vh] sm:max-w-lg">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">Book this workspace</h2>
              <p className="truncate text-sm text-base-content/60">{studio.title}</p>
            </div>
            <button className="btn btn-circle btn-ghost btn-sm" onClick={closeBooking} aria-label="Close">
              <X className="size-4" />
            </button>
          </div>
          {bookingOpen && <BookingPanel studio={studio} onBooked={closeBooking} />}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close">close</button>
        </form>
      </dialog>
    </div>
  );
}
