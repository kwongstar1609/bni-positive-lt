import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { DashboardPage } from "@/components/dashboard-page";

export const Route = createFileRoute("/")({
  component: () => (
    <Shell>
      <DashboardPage />
    </Shell>
  ),
});
