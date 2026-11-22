import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "@/components/reports-page";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/reports")({
  component: () => (
    <Shell>
      <ReportsPage />
    </Shell>
  ),
});
