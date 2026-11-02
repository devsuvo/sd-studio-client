"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import StudioForm from "@/components/studio-form";
import { PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import type { Studio, StudioInput } from "@/lib/types";

export default function AddStudioPage() {
  const router = useRouter();

  const create = async (data: StudioInput) => {
    try {
      await api<Studio>("/api/studios", { method: "POST", auth: true, body: data });
      toast.success("Studio added! It's now live in Explore Studios.");
      router.push("/my-listings");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New Studio"
        subtitle="Clear photos, amenities and pricing help creators book with confidence."
      />
      <StudioForm submitLabel="Add Studio" onSubmit={create} />
    </div>
  );
}
