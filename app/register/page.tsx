import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/auth-shell";
import { Spinner } from "@/components/ui";
import RegisterForm from "./register-form";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <AuthShell title="Register" subtitle="Create one account to book studios and host your own.">
      <Suspense fallback={<Spinner />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
