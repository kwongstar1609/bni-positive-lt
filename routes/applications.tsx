import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsPage } from "@/components/applications-page";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/applications")({
  component: () => (
    <Shell>
      <ApplicationsPage />
    </Shell>
  ),
});
