import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { VisitorsPage } from "@/components/visitors-page";

export const Route = createFileRoute("/visitors")({
  component: () => (
    <Shell>
      <VisitorsPage />
    </Shell>
  ),
});
