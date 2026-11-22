import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageTitle } from "@/components/bits";
import { useChapter } from "@/lib/chapter-store";
import { presentersDue } from "@/lib/insights";
import { formatDate, todayISO } from "@/lib/utils";

export function PresentationsPage() {
  const presentations = useChapter((s) => s.presentations);
  const members = useChapter((s) => s.members);
  const add = useChapter((s) => s.addPresentation);
  const due = presentersDue(members);
  const name = (id: string) => members.find((m) => m.id === id)?.name || "Unknown";

  return (
    <div>
      <PageTitle
        title="Presentations"
        lede="Saving a feature updates that member’s last presentation date, which is what the 5-minute queue on the dashboard uses."
      />
      <section className="card mb-4 p-4">
        <h2 className="font-display text-2xl">Due for a feature</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {due.map((m) => (
            <li key={m.id}>
              <Link to="/members/$memberId" params={{ memberId: m.id }} className="font-semibold hover:underline">
                {m.name}
              </Link>
              <span className="text-muted"> · {m.lastPresentation ? formatDate(m.lastPresentation) : "none on record"}</span>
            </li>
          ))}
          {due.length === 0 && <li className="text-muted">Everyone has featured in the last 10 weeks.</li>}
        </ul>
      </section>
      <form
        className="card mb-4 grid gap-3 p-4 md:grid-cols-5"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          add({
            memberId: String(data.get("member") || ""),
            title: String(data.get("title") || ""),
            date: String(data.get("date") || todayISO()),
            kind: String(data.get("kind") || "5-min") as "5-min" | "gains" | "20-sec",
          });
          e.currentTarget.reset();
          toast.success("Presentation recorded");
        }}
      >
        <select className="field" name="member" defaultValue={members[0]?.id}>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <input className="field md:col-span-2" name="title" placeholder="Title" required />
        <input className="field" type="date" name="date" defaultValue={todayISO()} />
        <select className="field" name="kind" defaultValue="5-min">
          <option value="5-min">5-min</option>
          <option value="gains">Gains</option>
          <option value="20-sec">20-sec</option>
        </select>
        <button className="btn md:col-span-5" type="submit">
          Save presentation
        </button>
      </form>
      <ul className="card divide-y divide-border">
        {presentations
          .slice()
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold">{p.title}</p>
                <p className="text-sm text-muted">
                  {name(p.memberId)} · {formatDate(p.date)}
                </p>
              </div>
              <span className="text-sm font-semibold">{p.kind}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
