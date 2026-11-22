import { createFileRoute } from "@tanstack/react-router";
import { MemberDetailPage } from "@/components/member-detail-page";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/members/$memberId")({
  component: function MemberRoute() {
    const { memberId } = Route.useParams();
    return (
      <Shell>
        <MemberDetailPage memberId={memberId} />
      </Shell>
    );
  },
});
