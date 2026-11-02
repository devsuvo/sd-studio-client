"use client";

import { Mail, UserCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import GoogleButton from "@/components/google-button";
import PasswordInput from "@/components/password-input";
import { clearTokenCache } from "@/lib/api";
import { signIn, useSession } from "@/lib/auth-client";

const DEMO = { email: "guest@sdstudio.dev", password: "Guest@12345" };

/** Only allow same-site relative redirects; otherwise go home. */
export function safeRedirect(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirect(params.get("redirect"));
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && session) router.replace(redirect);
  }, [isPending, session, redirect, router]);

  // BetterAuth sends failed Google sign-ins back here with ?error=...
  useEffect(() => {
    if (params.get("error")) toast.error("Google sign-in didn't complete. Please try again.");
  }, [params]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      toast.error("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    await clearTokenCache(); // never reuse another account's API token
    const { error: authError } = await signIn.email({ email: email.trim(), password });
    setSubmitting(false);
    if (authError) {
      const message =
        authError.status === 401 ? "Incorrect email or password." : (authError.message ?? "We couldn't log you in.");
      setError(message);
      toast.error(message);
      return;
    }
    toast.success("Logged in. Welcome back!");
    router.replace(redirect);
    router.refresh();
  };

  return (
    <div className="space-y-4">
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
          <div className="flex items-center justify-between">
            <legend className="fieldset-legend">Password</legend>
            <button
              type="button"
              className="link link-hover text-xs text-primary"
              onClick={() =>
                toast.info("Password reset is coming soon. For now, sign in with Google or contact support@studiospace.app.")
              }
            >
              Forgot password?
            </button>
          </div>
          <PasswordInput
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </fieldset>

        {error && (
          <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
          {submitting && <span className="loading loading-spinner loading-sm" />}
          Login
        </button>
      </form>

      <div className="divider text-xs text-base-content/50">OR</div>

      <GoogleButton redirectTo={redirect} />

      <button
        type="button"
        className="btn btn-ghost btn-sm w-full"
        onClick={() => {
          setEmail(DEMO.email);
          setPassword(DEMO.password);
          toast.info("Demo guest details filled in. Press Login.");
        }}
      >
        <UserCheck className="size-4" /> Use demo account
      </button>

      <p className="text-center text-sm text-base-content/70">
        Don&apos;t have an account?{" "}
        <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="link link-primary">
          Register
        </Link>
      </p>
    </div>
  );
}
