import { useState } from "react";
import { toast } from "sonner";
import { PageTitle } from "@/components/bits";
import { useChapter } from "@/lib/chapter-store";
import type { ChapterEvent } from "@/lib/types";
import { formatDate, todayISO } from "@/lib/utils";

const TYPES: ChapterEvent["type"][] = ["meeting", "training", "rehearsal", "social", "international", "birthday"];

const DOT: Record<ChapterEvent["type"], string> = {
  meeting: "bg-primary",
  training: "bg-yellow",
  rehearsal: "bg-fg",
  social: "bg-green",
  international: "bg-red",
  birthday: "bg-gray",
};

export function CalendarPage() {
  const events = useChapter((s) => s.events);
  const addEvent = useChapter((s) => s.addEvent);
  const [type, setType] = useState<"all" | ChapterEvent["type"]>("all");
  const visible = events
    .filter((e) => (type === "all" ? true : e.type === type))
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <PageTitle
        title="Calendar"
        lede="Meetings, MSP and MC trainings, rehearsals, international visits, dinners and birthdays live on one list. The next meeting is what seating and task due dates follow."
      />
      <form
        className="card mb-4 grid gap-3 p-4 md:grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          addEvent({
            title: String(data.get("title") || ""),
            date: String(data.get("date") || todayISO()),
            type: String(data.get("type") || "meeting") as ChapterEvent["type"],
            notes: String(data.get("notes") || ""),
          });
          e.currentTarget.reset();
          toast.success("Event added");
        }}
      >
        <input className="field md:col-span-2" name="title" placeholder="Event" required />
        <input className="field" type="date" name="date" defaultValue={todayISO()} />
        <select className="field" name="type" defaultValue="meeting">
          {TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <input className="field md:col-span-3" name="notes" placeholder="Notes" />
        <button className="btn" type="submit">
          Add event
        </button>
      </form>
      <div className="mb-3 flex flex-wrap gap-2">
        {(["all", ...TYPES] as const).map((t) => (
          <button key={t} className={type === t ? "btn" : "btn-ghost"} onClick={() => setType(t)}>
            {t}
          </button>
        ))}
      </div>
      <ul className="card divide-y divide-border">
        {visible.map((event) => (
          <li key={event.id} className="flex gap-3 p-4">
            <span className={`mt-1 size-3 shrink-0 rounded-full ${DOT[event.type]}`} />
            <div>
              <p className="font-semibold">{event.title}</p>
              <p className="text-sm text-muted">
                {formatDate(event.date)} · {event.type}
              </p>
              {event.notes ? <p className="mt-1 text-sm">{event.notes}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
