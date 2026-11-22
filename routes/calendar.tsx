import { createFileRoute } from "@tanstack/react-router";
import { CalendarPage } from "@/components/calendar-page";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/calendar")({
  component: () => (
    <Shell>
      <CalendarPage />
    </Shell>
  ),
});
