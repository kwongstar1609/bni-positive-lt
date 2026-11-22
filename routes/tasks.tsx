import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { TasksPage } from "@/components/tasks-page";

export const Route = createFileRoute("/tasks")({
  component: () => (
    <Shell>
      <TasksPage />
    </Shell>
  ),
});
