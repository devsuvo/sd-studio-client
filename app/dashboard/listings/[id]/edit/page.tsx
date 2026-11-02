"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import StudioForm from "@/components/studio-form";
import { ErrorState, Spinner } from "@/components/ui";
import { useFetch } from "@/hooks/use-fetch";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { Studio, StudioInput } from "@/lib/types";

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { data: studio, error, loading, reload } = useFetch<Studio>(`/api/studios/${id}`);

  const save = async (data: StudioInput) => {
    try {
      await api<Studio>(`/api/studios/${id}`, { method: "PATCH", auth: true, body: data });
      toast.success("Changes saved.");
      router.push("/dashboard/listings");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  if (loading) return <Spinner label="Loading listing" />;
  if (error || !studio) return <ErrorState message={error ?? "This listing couldn't be loaded."} onRetry={reload} />;
  if (session && studio.hostId !== session.user.id) {
    return <ErrorState message="Only the host of this studio can edit it." />;
  }

  return (
    <div>
      <Link href="/dashboard/listings" className="btn btn-ghost btn-sm -ml-3">
        <ArrowLeft className="size-4" /> My studios
      </Link>
      <h1 className="mt-2 text-3xl font-bold">Edit studio</h1>
      <p className="mb-6 mt-1 text-base-content/70">{studio.title}</p>
      <StudioForm initial={studio} submitLabel="Save changes" onSubmit={save} />
    </div>
  );
}
