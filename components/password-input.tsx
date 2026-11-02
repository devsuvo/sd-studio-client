"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

export default function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="input w-full">
      <Lock className="size-4 opacity-60" />
      <input {...props} type={visible ? "text" : "password"} className="grow" />
      <button
        type="button"
        className="btn btn-ghost btn-xs btn-circle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </label>
  );
}
