import { createFileRoute } from "@tanstack/react-router";
import { PresentationsPage } from "@/components/presentations-page";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/presentations")({
  component: () => (
    <Shell>
      <PresentationsPage />
    </Shell>
  ),
});
