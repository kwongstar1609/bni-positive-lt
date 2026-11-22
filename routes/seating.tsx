import { createFileRoute } from "@tanstack/react-router";
import { SeatingPage } from "@/components/seating-page";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/seating")({
  component: () => (
    <Shell>
      <SeatingPage />
    </Shell>
  ),
});
