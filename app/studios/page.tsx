import type { Metadata } from "next";
import { Suspense } from "react";
import { Spinner } from "@/components/ui";
import StudioBrowser from "./studio-browser";

export const metadata: Metadata = { title: "Explore studios" };

export default function StudiosPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold sm:text-4xl">Explore studios</h1>
      <p className="mt-2 text-base-content/70">Filter by craft, city, budget and crew size.</p>
      <Suspense fallback={<Spinner label="Loading studios" />}>
        <StudioBrowser />
      </Suspense>
    </div>
  );
}
