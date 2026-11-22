import { createFileRoute } from "@tanstack/react-router";
import { ManualPage } from "@/components/manual-page";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/manual")({
  component: () => (
    <Shell>
      <ManualPage />
    </Shell>
  ),
});
