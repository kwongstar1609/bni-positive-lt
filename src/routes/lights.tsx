import { createFileRoute } from "@tanstack/react-router";
import { LightsPage } from "@/components/lights-page";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/lights")({
  component: () => (
    <Shell>
      <LightsPage />
    </Shell>
  ),
});
