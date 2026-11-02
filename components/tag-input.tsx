"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

/** Type a value and press Enter (or tap a suggestion) to add it as a chip. */
export default function TagInput({
  value,
  onChange,
  placeholder,
  suggestions = [],
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  suggestions?: string[];
}) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const item = raw.trim();
    if (!item || value.some((v) => v.toLowerCase() === item.toLowerCase())) return;
    onChange([...value, item]);
    setDraft("");
  };

  const unused = suggestions.filter((s) => !value.includes(s));

  return (
    <div className="space-y-2">
      <div className="join w-full">
        <input
          className="input join-item w-full"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft);
            }
          }}
        />
        <button type="button" className="btn join-item" onClick={() => add(draft)} aria-label="Add">
          <Plus className="size-4" />
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((v) => (
            <span key={v} className="badge badge-primary badge-soft gap-1 py-3">
              {v}
              <button type="button" onClick={() => onChange(value.filter((x) => x !== v))} aria-label={`Remove ${v}`}>
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      {unused.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {unused.map((s) => (
            <button key={s} type="button" className="badge badge-outline cursor-pointer hover:badge-primary" onClick={() => add(s)}>
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
