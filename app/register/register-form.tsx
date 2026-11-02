"use client";

import { Check, ImageIcon, Mail, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import GoogleButton from "@/components/google-button";
import PasswordInput from "@/components/password-input";
import { signOut, signUp, useSession } from "@/lib/auth-client";
import { safeRedirect } from "../login/login-form";

const RULES = [
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
];

type Field = "name" | "email" | "image" | "password";

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirect(params.get("redirect"));
  const { data: session, isPending } = useSession();
  const [form, setForm] = useState<Record<Field, string>>({ name: "", email: "", image: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  // Set while we sign the brand-new account back out, so the "already logged in" redirect doesn't fire.
  const registering = useRef(false);

  useEffect(() => {
    if (!isPending && session && !registering.current) router.replace(redirect);
  }, [isPending, session, redirect, router]);

  const set = (key: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const next: Partial<Record<Field, string>> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Please enter a valid email address.";
    if (form.image.trim() && !/^https?:\/\/\S+$/.test(form.image.trim())) next.image = "Photo URL must start with http:// or https://";
    const failed = RULES.filter((r) => !r.test(form.password));
    if (failed.length) next.password = `Password needs: ${failed.map((r) => r.label.toLowerCase()).join(", ")}.`;
    return next;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    const first = Object.values(found)[0];
    if (first) {
      toast.error(first);
      return; // never register with invalid input
    }

    setSubmitting(true);
    registering.current = true;
    const { error } = await signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      image: form.image.trim() || undefined,
    });
    if (error) {
      registering.current = false;
      setSubmitting(false);
      const message =
        error.code === "USER_ALREADY_EXISTS" || error.status === 422
          ? "An account with this email already exists. Try logging in."
          : (error.message ?? "We couldn't create your account. Please try again.");
      setErrors({ email: message });
      toast.error(message);
      return;
    }
    await signOut();
    setSubmitting(false);
    toast.success("Account created! Please log in to continue.");
    const next = new URLSearchParams({ email: form.email.trim() });
    if (redirect !== "/") next.set("redirect", redirect);
    router.push(`/login?${next}`);
  };

  const fieldError = (key: Field) =>
    errors[key] && (
      <p role="alert" className="mt-1 text-xs text-error">
        {errors[key]}
      </p>
    );

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="space-y-3" noValidate>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <label className={`input w-full ${errors.name ? "input-error" : ""}`}>
            <User className="size-4 opacity-60" />
            <input className="grow" placeholder="Your name" autoComplete="name" value={form.name} onChange={set("name")} />
          </label>
          {fieldError("name")}
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Email</legend>
          <label className={`input w-full ${errors.email ? "input-error" : ""}`}>
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
          {fieldError("email")}
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Photo URL</legend>
          <label className={`input w-full ${errors.image ? "input-error" : ""}`}>
            <ImageIcon className="size-4 opacity-60" />
            <input className="grow" type="url" placeholder="https://…" value={form.image} onChange={set("image")} />
          </label>
          {fieldError("image")}
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Password</legend>
          <PasswordInput
            placeholder="Create a password"
            autoComplete="new-password"
            value={form.password}
            onChange={set("password")}
          />
          <ul className="mt-1 grid gap-1 text-xs sm:grid-cols-3">
            {RULES.map((r) => {
              const ok = r.test(form.password);
              return (
                <li key={r.label} className={`flex items-center gap-1 ${ok ? "text-success" : "text-base-content/60"}`}>
                  {ok ? <Check className="size-3" /> : <X className="size-3" />} {r.label}
                </li>
              );
            })}
          </ul>
          {fieldError("password")}
        </fieldset>

        <button type="submit" className="btn btn-primary mt-2 w-full" disabled={submitting}>
          {submitting && <span className="loading loading-spinner loading-sm" />}
          Register
        </button>
      </form>

      <div className="divider text-xs text-base-content/50">OR</div>

      <GoogleButton redirectTo="/" label="Sign up with Google" />

      <p className="text-center text-sm text-base-content/70">
        Already have an account?{" "}
        <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="link link-primary">
          Login
        </Link>
      </p>
    </div>
  );
}
