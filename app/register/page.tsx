import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/auth-shell";
import { Spinner } from "@/components/ui";
import RegisterForm from "./register-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account" subtitle="One account lets you book studios and host your own.">
      <Suspense fallback={<Spinner />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
