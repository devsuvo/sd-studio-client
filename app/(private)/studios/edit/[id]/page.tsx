"use client";

import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import StudioForm from "@/components/studio-form";
import { EmptyState, ErrorState, PageHeader, Spinner } from "@/components/ui";
import { useFetch } from "@/hooks/use-fetch";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { Studio, StudioInput } from "@/lib/types";

export default function UpdateStudioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { data: studio, error, loading, reload } = useFetch<Studio>(`/api/studios/${id}`);

  const save = async (data: StudioInput) => {
    try {
      await api<Studio>(`/api/studios/${id}`, { method: "PATCH", auth: true, body: data });
      toast.success("Studio updated successfully.");
      router.push("/my-listings");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  if (loading) return <Spinner label="Loading listing" />;
  if (error || !studio) return <ErrorState message={error ?? "This listing couldn't be loaded."} onRetry={reload} />;
  if (session && studio.ownerEmail !== session.user.email) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="You can't edit this studio"
        message="Only the host who listed this studio can update it."
        action={
          <Link href="/my-listings" className="btn btn-primary btn-sm">
            Go to My Studio Listings
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <Link href="/my-listings" className="btn btn-ghost btn-sm -ml-3 mb-2">
        <ArrowLeft className="size-4" /> My Studio Listings
      </Link>
      <PageHeader title="Update Studio" subtitle={studio.title} />
      <StudioForm initial={studio} submitLabel="Save Changes" onSubmit={save} />
    </div>
  );
}
