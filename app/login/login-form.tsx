"use client";

import { Mail, UserCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PasswordInput from "@/components/password-input";
import { clearTokenCache } from "@/lib/api";
import { signIn, useSession } from "@/lib/auth-client";

const DEMO = { email: "guest@sdstudio.dev", password: "Guest@12345" };

/** Only allow same-site relative redirects. */
export function safeRedirect(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirect(params.get("redirect"));
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && session) router.replace(redirect);
  }, [isPending, session, redirect, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    const { error } = await signIn.email({ email: email.trim(), password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message ?? "Those details don't match an account.");
      return;
    }
    clearTokenCache();
    toast.success("Logged in. Welcome back!");
    router.replace(redirect);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Email</legend>
        <label className="input w-full">
          <Mail className="size-4 opacity-60" />
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="grow"
            required
          />
        </label>
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Password</legend>
        <PasswordInput
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </fieldset>

      <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
        {submitting && <span className="loading loading-spinner loading-sm" />}
        Log in
      </button>

      <button
        type="button"
        className="btn btn-outline w-full"
        onClick={() => {
          setEmail(DEMO.email);
          setPassword(DEMO.password);
          toast.info("Demo guest details filled in. Press Log in.");
        }}
      >
        <UserCheck className="size-4" /> Use demo account
      </button>

      <p className="text-center text-sm text-base-content/70">
        New to SD Studio?{" "}
        <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="link link-primary">
          Create an account
        </Link>
      </p>
    </form>
  );
}
