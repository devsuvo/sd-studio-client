"use client";

import { useState } from "react";

export default function UserAvatar({
  name,
  image,
  size = "size-9",
}: {
  name?: string | null;
  image?: string | null;
  size?: string;
}) {
  const [broken, setBroken] = useState(false);
  const initials = (name ?? "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (image && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ?? "User"}
        onError={() => setBroken(true)}
        className={`${size} rounded-full object-cover ring-2 ring-base-300`}
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <span className={`${size} grid place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-content`}>
      {initials}
    </span>
  );
}
