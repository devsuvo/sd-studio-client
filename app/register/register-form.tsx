"use client";

import { Check, ImageIcon, Mail, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PasswordInput from "@/components/password-input";
import { clearTokenCache } from "@/lib/api";
import { signUp, useSession } from "@/lib/auth-client";
import { safeRedirect } from "../login/login-form";

const RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirect(params.get("redirect"));
  const { data: session, isPending } = useSession();
  const [form, setForm] = useState({ name: "", email: "", image: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && session) router.replace(redirect);
  }, [isPending, session, redirect, router]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return toast.error("Please enter a valid email address.");
    if (form.image && !/^https?:\/\/\S+$/.test(form.image.trim())) return toast.error("Photo URL must start with http:// or https://");
    const failed = RULES.find((r) => !r.test(form.password));
    if (failed) return toast.error(`Password needs: ${failed.label.toLowerCase()}.`);

    setSubmitting(true);
    const { error } = await signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      image: form.image.trim() || undefined,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message ?? "We couldn't create your account. Please try again.");
      return;
    }
    clearTokenCache();
    toast.success("Account created. Welcome to SD Studio!");
    router.replace(redirect);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Full name</legend>
        <label className="input w-full">
          <User className="size-4 opacity-60" />
          <input className="grow" placeholder="Your name" autoComplete="name" value={form.name} onChange={set("name")} />
        </label>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Email</legend>
        <label className="input w-full">
          <Mail className="size-4 opacity-60" />
          <input
            className="grow"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
          />
        </label>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">
          Photo URL <span className="font-normal text-base-content/60">(optional)</span>
        </legend>
        <label className="input w-full">
          <ImageIcon className="size-4 opacity-60" />
          <input className="grow" type="url" placeholder="https://…" value={form.image} onChange={set("image")} />
        </label>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Password</legend>
        <PasswordInput
          placeholder="Create a password"
          autoComplete="new-password"
          value={form.password}
          onChange={set("password")}
        />
        <ul className="mt-1 grid grid-cols-2 gap-1 text-xs">
          {RULES.map((r) => {
            const ok = r.test(form.password);
            return (
              <li key={r.label} className={`flex items-center gap-1 ${ok ? "text-success" : "text-base-content/60"}`}>
                {ok ? <Check className="size-3" /> : <X className="size-3" />} {r.label}
              </li>
            );
          })}
        </ul>
      </fieldset>

      <button type="submit" className="btn btn-primary mt-2 w-full" disabled={submitting}>
        {submitting && <span className="loading loading-spinner loading-sm" />}
        Create account
      </button>

      <p className="text-center text-sm text-base-content/70">
        Already have an account?{" "}
        <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="link link-primary">
          Log in
        </Link>
      </p>
    </form>
  );
}
