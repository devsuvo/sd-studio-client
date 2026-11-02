import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/auth-shell";
import { Spinner } from "@/components/ui";
import LoginForm from "./login-form";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <AuthShell title="Login" subtitle="Welcome back! Log in to book studios and manage your listings.">
      <Suspense fallback={<Spinner />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
