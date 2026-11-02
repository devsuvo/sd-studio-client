"use client";

import { ImagePlus, Link2, Lock, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { AMENITY_SUGGESTIONS, CATEGORIES, CATEGORY_LABELS } from "@/lib/constants";
import { formatHour } from "@/lib/format";
import type { Studio, StudioInput } from "@/lib/types";
import StudioImage from "./studio-image";
import TagInput from "./tag-input";

const EMPTY: StudioInput = {
  title: "",
  description: "",
  category: "Photography",
  city: "",
  address: "",
  hourlyRate: 30,
  securityDeposit: 50,
  capacity: 6,
  sizeSqft: 600,
  minHours: 1,
  openHour: 9,
  closeHour: 21,
  amenities: [],
  equipment: [],
  images: [],
  rules: "",
};

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function toInput(studio?: Studio): StudioInput {
  if (!studio) return EMPTY;
  return {
    title: studio.title,
    description: studio.description,
    category: studio.category,
    city: studio.city,
    address: studio.address,
    hourlyRate: studio.hourlyRate,
    securityDeposit: studio.securityDeposit ?? 0,
    capacity: studio.capacity,
    sizeSqft: studio.sizeSqft,
    minHours: studio.minHours,
    openHour: studio.openHour,
    closeHour: studio.closeHour,
    amenities: studio.amenities,
    equipment: studio.equipment,
    images: studio.images,
    rules: studio.rules,
  };
}

function validate(f: StudioInput): string | null {
  if (f.title.trim().length < 5) return "Give your studio a title of at least 5 characters.";
  if (!(f.hourlyRate >= 5)) return "Hourly rate must be at least $5.";
  if (!(f.securityDeposit >= 0)) return "Security deposit can't be negative.";
  if (!(f.capacity >= 1)) return "Max capacity must be at least 1 person.";
  if (f.city.trim().length < 2) return "Add the city your studio is in.";
  if (f.address.trim().length < 5) return "Add a street address.";
  if (f.images.length === 0) return "Add at least one image (upload or paste a URL).";
  if (f.description.trim().length < 30) return "Write a detailed overview of at least 30 characters.";
  if (!(f.sizeSqft >= 50)) return "Size must be at least 50 sq ft.";
  if (f.closeHour - f.openHour < f.minHours) return "Opening hours must fit at least one minimum-length booking.";
  return null;
}

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.readAsDataURL(file);
  });

export default function StudioForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Studio;
  submitLabel: string;
  onSubmit: (data: StudioInput) => Promise<void>;
}) {
  const { data: session } = useSession();
  const [form, setForm] = useState<StudioInput>(() => toInput(initial));
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Editing shows the listing's owner; creating shows the signed-in user.
  const ownerName = initial?.ownerName ?? session?.user.name ?? "";
  const ownerEmail = initial?.ownerEmail ?? session?.user.email ?? "";

  const set = <K extends keyof StudioInput>(key: K, value: StudioInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const text = (key: "title" | "description" | "city" | "address" | "rules") => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value),
  });
  const num = (key: "hourlyRate" | "securityDeposit" | "capacity" | "sizeSqft") => ({
    type: "number",
    value: Number.isNaN(form[key]) ? "" : form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(key, e.target.valueAsNumber),
  });

  const addImage = (url: string) => {
    if (form.images.includes(url)) return toast.info("That photo is already added.");
    if (form.images.length >= 10) return toast.error("You can add up to 10 photos.");
    setForm((f) => ({ ...f, images: [...f.images, url] }));
    return true;
  };

  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (!/^https?:\/\/\S+$/.test(url)) {
      toast.error("Paste a full image URL starting with http:// or https://");
      return;
    }
    if (addImage(url) === true) setImageUrl("");
  };

  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file (JPG, PNG or WebP).");
    if (file.size > MAX_UPLOAD_BYTES) return toast.error("Images must be 5MB or smaller.");
    setUploading(true);
    try {
      const image = await readAsDataUrl(file);
      const { url } = await api<{ url: string }>("/api/uploads", { method: "POST", auth: true, body: { image } });
      if (addImage(url) === true) toast.success("Image uploaded.");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const toggleAmenity = (a: string) =>
    set("amenities", form.amenities.includes(a) ? form.amenities.filter((x) => x !== a) : [...form.amenities, a]);
  const customAmenities = form.amenities.filter((a) => !AMENITY_SUGGESTIONS.includes(a));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validate(form);
    if (problem) {
      toast.error(problem);
      return;
    }
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  const hourOptions = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i).map((h) => (
      <option key={h} value={h}>
        {formatHour(h)}
      </option>
    ));

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      {/* Host info (read-only) */}
      <section className="rounded-box border border-base-300 bg-base-200/50 p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Lock className="size-4" /> Host information
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Your name</legend>
            <input className="input w-full" value={ownerName} readOnly aria-readonly />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Your email</legend>
            <input className="input w-full" value={ownerEmail} readOnly aria-readonly />
          </fieldset>
        </div>
      </section>

      <section className="rounded-box border border-base-300 p-6">
        <h2 className="text-lg font-semibold">Studio details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <fieldset className="fieldset md:col-span-2">
            <legend className="fieldset-legend">Title</legend>
            <input className="input w-full" placeholder="e.g. Daylight Cyc Wall Loft" maxLength={100} {...text("title")} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Category</legend>
            <select
              className="select w-full"
              value={form.category}
              onChange={(e) => set("category", e.target.value as StudioInput["category"])}
            >
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {CATEGORY_LABELS[c.name]}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Max capacity (people)</legend>
            <input className="input w-full" min={1} {...num("capacity")} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Hourly rate ($)</legend>
            <input className="input w-full" min={5} step="0.5" {...num("hourlyRate")} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Security deposit ($)</legend>
            <input className="input w-full" min={0} step="1" {...num("securityDeposit")} />
            <span className="label">Refundable, returned after the session.</span>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">City</legend>
            <input className="input w-full" placeholder="e.g. Dhaka" {...text("city")} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Location / address</legend>
            <input className="input w-full" placeholder="Building, road and area" {...text("address")} />
          </fieldset>
          <fieldset className="fieldset md:col-span-2">
            <legend className="fieldset-legend">Detailed overview</legend>
            <textarea
              className="textarea w-full"
              rows={5}
              maxLength={3000}
              placeholder="What makes this space great for creators? Light, acoustics, layout, who it suits best…"
              {...text("description")}
            />
            <span className="label">{form.description.trim().length} / 3000 characters (minimum 30)</span>
          </fieldset>
        </div>
      </section>

      <section className="rounded-box border border-base-300 p-6">
        <h2 className="text-lg font-semibold">Images</h2>
        <p className="mt-1 text-sm text-base-content/60">
          Upload a photo (stored on imgbb) or paste an image URL. The first image is your cover.
        </p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <div className="join w-full">
            <label className="input join-item w-full">
              <Link2 className="size-4 opacity-60" />
              <input
                className="grow"
                placeholder="https://images.example.com/my-studio.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImageUrl();
                  }
                }}
              />
            </label>
            <button type="button" className="btn join-item" onClick={addImageUrl}>
              <ImagePlus className="size-4" /> Add URL
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => upload(e.target.files?.[0])}
          />
          <button
            type="button"
            className="btn btn-secondary shrink-0"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <span className="loading loading-spinner loading-sm" /> : <Upload className="size-4" />}
            {uploading ? "Uploading…" : "Upload image"}
          </button>
        </div>
        {form.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {form.images.map((src, i) => (
              <div key={src} className="relative overflow-hidden rounded-xl">
                <StudioImage src={src} alt={`Photo ${i + 1}`} className="aspect-[4/3] w-full" />
                {i === 0 && <span className="badge badge-primary badge-sm absolute left-2 top-2">Cover</span>}
                <button
                  type="button"
                  className="btn btn-circle btn-error btn-xs absolute right-2 top-2"
                  onClick={() => set("images", form.images.filter((x) => x !== src))}
                  aria-label="Remove photo"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-box border border-base-300 p-6">
        <h2 className="text-lg font-semibold">Amenities</h2>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-5">
          {AMENITY_SUGGESTIONS.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={form.amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
              />
              {a}
            </label>
          ))}
        </div>
        <fieldset className="fieldset mt-4">
          <legend className="fieldset-legend">Other amenities</legend>
          <TagInput
            value={customAmenities}
            onChange={(custom) =>
              set("amenities", [...form.amenities.filter((a) => AMENITY_SUGGESTIONS.includes(a)), ...custom])
            }
            placeholder="Type an amenity and press Enter"
          />
        </fieldset>
      </section>

      <section className="rounded-box border border-base-300 p-6">
        <h2 className="text-lg font-semibold">Hours, size and gear</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Opens at</legend>
            <select className="select w-full" value={form.openHour} onChange={(e) => set("openHour", Number(e.target.value))}>
              {hourOptions(0, 23)}
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Closes at</legend>
            <select className="select w-full" value={form.closeHour} onChange={(e) => set("closeHour", Number(e.target.value))}>
              {hourOptions(1, 24)}
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Minimum booking</legend>
            <select className="select w-full" value={form.minHours} onChange={(e) => set("minHours", Number(e.target.value))}>
              {[1, 2, 3, 4, 6, 8].map((h) => (
                <option key={h} value={h}>
                  {h} hour{h > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Size (sq ft)</legend>
            <input className="input w-full" min={50} {...num("sizeSqft")} />
          </fieldset>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Equipment included</legend>
            <TagInput value={form.equipment} onChange={(v) => set("equipment", v)} placeholder="e.g. Profoto B10 kit" />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              House rules <span className="font-normal text-base-content/60">(optional)</span>
            </legend>
            <textarea className="textarea w-full" rows={3} maxLength={1500} placeholder="Anything guests should know" {...text("rules")} />
          </fieldset>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary w-full sm:w-auto sm:min-w-56" disabled={saving || uploading}>
          {saving && <span className="loading loading-spinner loading-sm" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
