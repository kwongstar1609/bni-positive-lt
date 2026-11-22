import { toast } from "sonner";
import { PageTitle } from "@/components/bits";
import { useChapter } from "@/lib/chapter-store";
import { nextMeeting, seatWarnings } from "@/lib/insights";
import { TABLES } from "@/lib/tables";
import { formatDate } from "@/lib/utils";

export function SeatingPage() {
  const seats = useChapter((s) => s.seats);
  const members = useChapter((s) => s.members);
  const visitors = useChapter((s) => s.visitors);
  const events = useChapter((s) => s.events);
  const autoSeat = useChapter((s) => s.autoSeat);
  const assignSeat = useChapter((s) => s.assignSeat);
  const clearSeat = useChapter((s) => s.clearSeat);
  const meeting = nextMeeting(events);
  const warnings = seatWarnings(seats, visitors, members);
  const label = (kind: "member" | "visitor", id: string) =>
    kind === "member" ? members.find((m) => m.id === id)?.name : visitors.find((v) => v.id === id)?.name;

  return (
    <div>
      <PageTitle
        title="Seating"
        lede={`萬怡酒店 floor. Visitor tables are 1, 2, 3, 5 and 6. ${meeting ? `Next meeting ${formatDate(meeting.date)}.` : "Add a chapter meeting on the calendar so hosts know the date."}`}
      />
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          className="btn"
          onClick={() => {
            autoSeat();
            toast.success("Seated visitors with their inviter, then members by category");
          }}
        >
          Auto-seat this meeting
        </button>
      </div>
      {warnings.length > 0 && (
        <ul className="card mb-4 p-4 text-sm">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {TABLES.map((table) => {
          const here = seats.filter((s) => s.tableId === table.id).sort((a, b) => a.slot - b.slot);
          return (
            <section key={table.id} className="card p-4">
              <p className="font-display text-xl">{table.label}</p>
              <p className="text-sm text-muted">
                {table.note} · {table.seats} seats
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {here.map((seat) => (
                  <li key={seat.slot} className="flex items-center justify-between gap-2">
                    <span>
                      {seat.slot + 1}. {label(seat.kind, seat.personId) || "Unknown"}{" "}
                      <span className="text-muted">({seat.kind})</span>
                    </span>
                    <button className="text-sm font-semibold text-primary" onClick={() => clearSeat(table.id, seat.slot)}>
                      Remove
                    </button>
                  </li>
                ))}
                {here.length === 0 && <li className="text-muted">Empty</li>}
              </ul>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <select
                  className="field"
                  defaultValue=""
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const used = here.map((s) => s.slot);
                    const slot = Array.from({ length: table.seats }, (_, i) => i).find((i) => !used.includes(i));
                    if (slot === undefined) {
                      toast.error("That table is full");
                      return;
                    }
                    assignSeat(table.id, slot, "member", e.target.value);
                    e.target.value = "";
                  }}
                >
                  <option value="">Add member</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <select
                  className="field"
                  defaultValue=""
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const used = here.map((s) => s.slot);
                    const slot = Array.from({ length: table.seats }, (_, i) => i).find((i) => !used.includes(i));
                    if (slot === undefined) {
                      toast.error("That table is full");
                      return;
                    }
                    assignSeat(table.id, slot, "visitor", e.target.value);
                    e.target.value = "";
                  }}
                >
                  <option value="">Add visitor</option>
                  {visitors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
