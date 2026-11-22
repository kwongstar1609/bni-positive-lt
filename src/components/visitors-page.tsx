import { toast } from "sonner";
import { PageTitle } from "@/components/bits";
import { useChapter } from "@/lib/chapter-store";
import type { VisitorStatus } from "@/lib/types";

export function VisitorsPage() {
  const visitors = useChapter((s) => s.visitors);
  const members = useChapter((s) => s.members);
  const addVisitor = useChapter((s) => s.addVisitor);
  const setStatus = useChapter((s) => s.setVisitorStatus);
  const nameOf = (id: string) => members.find((m) => m.id === id)?.name || "—";

  return (
    <div>
      <PageTitle
        title="Visitors"
        lede="A confirmed visitor shows up on the seating plan. Marking someone as applied opens an application for the VP, linked back to this visit."
      />
      <form
        className="card mb-4 grid gap-3 p-4 md:grid-cols-6"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const name = String(data.get("name") || "").trim();
          if (!name) return;
          addVisitor({
            name,
            company: String(data.get("company") || ""),
            invitedById: String(data.get("invitedBy") || ""),
            interest: Number(data.get("interest") || 3),
            knowsBni: Number(data.get("knows") || 2),
            notes: String(data.get("notes") || ""),
            status: "invited",
          });
          e.currentTarget.reset();
          toast.success("Visitor added");
        }}
      >
        <input className="field" name="name" placeholder="Name" required />
        <input className="field" name="company" placeholder="Company" />
        <select className="field" name="invitedBy" defaultValue={members[0]?.id}>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <input className="field" name="interest" type="number" min={1} max={5} defaultValue={3} title="Interest 1-5" />
        <input className="field" name="knows" type="number" min={1} max={5} defaultValue={2} title="Knows BNI 1-5" />
        <button className="btn" type="submit">
          Add visitor
        </button>
        <input className="field md:col-span-6" name="notes" placeholder="How hungry are they, and what do they want?" />
      </form>
      <ul className="card divide-y divide-border">
        {visitors.map((v) => (
          <li key={v.id} className="grid gap-2 p-4 md:grid-cols-[1fr_180px]">
            <div>
              <p className="font-semibold">
                {v.name} <span className="font-normal text-muted">· interest {v.interest}/5 · knows BNI {v.knowsBni}/5</span>
              </p>
              <p className="text-sm text-muted">
                {v.company || "No company"} · invited by {nameOf(v.invitedById)}
              </p>
              {v.notes ? <p className="mt-1 text-sm">{v.notes}</p> : null}
            </div>
            <select className="field" value={v.status} onChange={(e) => setStatus(v.id, e.target.value as VisitorStatus)}>
              <option value="invited">Invited</option>
              <option value="confirmed">Confirmed</option>
              <option value="attended">Attended</option>
              <option value="applied">Applied</option>
              <option value="declined">Declined</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
