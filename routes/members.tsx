import { createFileRoute } from "@tanstack/react-router";
import { MembersPage } from "@/components/members-page";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/members")({
  component: () => (
    <Shell>
      <MembersPage />
    </Shell>
  ),
});
