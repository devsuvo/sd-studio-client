import { Camera, Clapperboard, Mic, Music, Palette, Footprints, type LucideIcon } from "lucide-react";
import type { Category } from "./types";

export const CATEGORIES: { name: Category; icon: LucideIcon; blurb: string }[] = [
  { name: "Photography", icon: Camera, blurb: "Cyc walls, daylight lofts and portrait sets" },
  { name: "Film & Video", icon: Clapperboard, blurb: "Sound stages, green screens and grip-ready floors" },
  { name: "Podcast", icon: Mic, blurb: "Treated rooms with multi-cam setups" },
  { name: "Music Recording", icon: Music, blurb: "Tracking rooms, vocal booths and mix suites" },
  { name: "Art Workshop", icon: Palette, blurb: "Easels, wheels, kilns and natural light" },
  { name: "Dance & Rehearsal", icon: Footprints, blurb: "Sprung floors and mirror walls" },
];

export const AMENITY_SUGGESTIONS = [
  "Wi-Fi",
  "Air conditioning",
  "Parking",
  "Makeup station",
  "Changing room",
  "Green room",
  "Kitchenette",
  "Natural light",
  "Freight elevator",
  "Wheelchair accessible",
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top rated" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f97352"/><stop offset="1" stop-color="#4338ca"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><circle cx="200" cy="150" r="38" fill="none" stroke="white" stroke-opacity=".7" stroke-width="6"/><rect x="150" y="104" width="100" height="92" rx="14" fill="none" stroke="white" stroke-opacity=".7" stroke-width="6"/></svg>`,
  );
