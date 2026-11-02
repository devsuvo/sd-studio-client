"use client";

import { useState } from "react";
import { FALLBACK_IMAGE } from "@/lib/constants";

/** Plain <img> so hosts can use any image URL; falls back to a branded placeholder if it fails. */
export default function StudioImage({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={!src || failed ? FALLBACK_IMAGE : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
