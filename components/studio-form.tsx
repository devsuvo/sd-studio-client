"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AMENITY_SUGGESTIONS, CATEGORIES } from "@/lib/constants";
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
  cleaningFee: 0,
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

function toInput(studio?: Studio): StudioInput {
  if (!studio) return EMPTY;
  const { _id, hostId, hostName, hostEmail, rating, reviewCount, createdAt, ...rest } = studio;
  void [_id, hostId, hostName, hostEmail, rating, reviewCount, createdAt];
  return rest;
}

function validate(f: StudioInput): string | null {
  if (f.title.trim().length < 5) return "Give your studio a title of at least 5 characters.";
  if (f.description.trim().length < 30) return "Describe the space in at least 30 characters.";
  if (f.city.trim().length < 2) return "Add the city your studio is in.";
  if (f.address.trim().length < 5) return "Add a street address.";
  if (!(f.hourlyRate >= 5)) return "Hourly rate must be at least $5.";
  if (f.cleaningFee < 0) return "Cleaning fee can't be negative.";
  if (!(f.capacity >= 1)) return "Capacity must be at least 1 person.";
  if (!(f.sizeSqft >= 50)) return "Size must be at least 50 sq ft.";
  if (f.closeHour - f.openHour < f.minHours) return "Opening hours must fit at least one minimum-length booking.";
  if (f.images.length === 0) return "Add at least one photo URL.";
  return null;
}

export default function StudioForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Studio;
  submitLabel: string;
  onSubmit: (data: StudioInput) => Promise<void>;
}) {
  const [form, setForm] = useState<StudioInput>(() => toInput(initial));
  const [imageDraft, setImageDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof StudioInput>(key: K, value: StudioInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const text = (key: "title" | "description" | "city" | "address" | "rules") => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value),
  });
  const num = (key: "hourlyRate" | "cleaningFee" | "capacity" | "sizeSqft") => ({
    type: "number",
    value: Number.isNaN(form[key]) ? "" : form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(key, e.target.valueAsNumber),
  });

  const addImage = () => {
    const url = imageDraft.trim();
    if (!/^https?:\/\/\S+$/.test(url)) {
      toast.error("Paste a full image URL starting with http:// or https://");
      return;
    }
    if (form.images.includes(url)) return toast.info("That photo is already added.");
    if (form.images.length >= 10) return toast.error("You can add up to 10 photos.");
    set("images", [...form.images, url]);
    setImageDraft("");
  };

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
    <form onSubmit={submit} className="space-y-8" noValidate>
      <section className="rounded-box border border-base-300 p-6">
        <h2 className="text-lg font-semibold">The basics</h2>
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
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">City</legend>
            <input className="input w-full" placeholder="e.g. Dhaka" {...text("city")} />
          </fieldset>
          <fieldset className="fieldset md:col-span-2">
            <legend className="fieldset-legend">Street address</legend>
            <input className="input w-full" placeholder="Building, road and area" {...text("address")} />
          </fieldset>
          <fieldset className="fieldset md:col-span-2">
            <legend className="fieldset-legend">Description</legend>
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
        <h2 className="text-lg font-semibold">Pricing, size and hours</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Hourly rate (USD)</legend>
            <input className="input w-full" min={5} step="0.5" {...num("hourlyRate")} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Cleaning fee (USD)</legend>
            <input className="input w-full" min={0} step="0.5" {...num("cleaningFee")} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Capacity (people)</legend>
            <input className="input w-full" min={1} {...num("capacity")} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Size (sq ft)</legend>
            <input className="input w-full" min={50} {...num("sizeSqft")} />
          </fieldset>
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
        </div>
      </section>

      <section className="rounded-box border border-base-300 p-6">
        <h2 className="text-lg font-semibold">Photos</h2>
        <p className="mt-1 text-sm text-base-content/60">Paste image links. The first photo is your cover.</p>
        <div className="join mt-4 w-full">
          <input
            className="input join-item w-full"
            placeholder="https://images.example.com/my-studio.jpg"
            value={imageDraft}
            onChange={(e) => setImageDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addImage();
              }
            }}
          />
          <button type="button" className="btn join-item" onClick={addImage}>
            <ImagePlus className="size-4" /> Add
          </button>
        </div>
        {form.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {form.images.map((src, i) => (
              <div key={src} className="group relative overflow-hidden rounded-xl">
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
        <h2 className="text-lg font-semibold">Amenities, gear and rules</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Amenities</legend>
            <TagInput
              value={form.amenities}
              onChange={(v) => set("amenities", v)}
              placeholder="Type and press Enter"
              suggestions={AMENITY_SUGGESTIONS}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Equipment included</legend>
            <TagInput
              value={form.equipment}
              onChange={(v) => set("equipment", v)}
              placeholder="e.g. Profoto B10 kit"
            />
          </fieldset>
          <fieldset className="fieldset lg:col-span-2">
            <legend className="fieldset-legend">
              House rules <span className="font-normal text-base-content/60">(optional)</span>
            </legend>
            <textarea className="textarea w-full" rows={3} maxLength={1500} placeholder="Anything guests should know" {...text("rules")} />
          </fieldset>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary btn-wide" disabled={saving}>
          {saving && <span className="loading loading-spinner loading-sm" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
