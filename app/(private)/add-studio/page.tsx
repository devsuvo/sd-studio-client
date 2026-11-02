"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import StudioForm from "@/components/studio-form";
import { api } from "@/lib/api";
import type { Studio, StudioInput } from "@/lib/types";

export default function NewListingPage() {
  const router = useRouter();

  const create = async (data: StudioInput) => {
    try {
      const studio = await api<Studio>("/api/studios", { method: "POST", auth: true, body: data });
      toast.success("Your studio is live!", {
        action: { label: "View listing", onClick: () => router.push(`/studios/${studio._id}`) },
      });
      router.push("/dashboard/listings");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">List a studio</h1>
      <p className="mb-6 mt-1 text-base-content/70">
        Clear photos, gear and hours help creators book with confidence.
      </p>
      <StudioForm submitLabel="Publish studio" onSubmit={create} />
    </div>
  );
}
