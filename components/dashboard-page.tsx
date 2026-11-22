import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { LightPill, PageTitle, Stat } from "@/components/bits";
import { useChapter } from "@/lib/chapter-store";
import {
  chapterPulse,
  coachingList,
  memberScore,
  nextMeeting,
  openTasks,
  suggestedTasks,
  unrecordedPresentations,
  upcomingEvents,
  visitorsToSeat,
} from "@/lib/insights";
import { formatDate } from "@/lib/utils";

export function DashboardPage() {
  const state = useChapter();
  const active = state.members.filter((member) => member.active);
  const scored = active.map((member) => memberScore(member));
  const green = scored.filter((score) => score.light === "green").length;
  const coaching = coachingList(state.members);
  const urgent = coaching.filter((row) => !row.edge);
  const edge = coaching.filter((row) => row.edge);
  const tasks = openTasks(state.tasks);
  const events = upcomingEvents(state.events);
  const meeting = nextMeeting(state.events);
  const coming = visitorsToSeat(state.visitors);
  const openApps = state.applications.filter((app) => app.status === "interview" || app.status === "voting");
  const pulse = chapterPulse(state.members, state.settings.goals);
  const ideas = suggestedTasks({
    members: state.members,
    tasks: state.tasks,
    visitors: state.visitors,
    applications: state.applications,
    events: state.events,
    goals: state.settings.goals,
  });
  const noDates = unrecordedPresentations(state.members);

  return (
    <div>
      <PageTitle
        title="Chapter desk"
        lede={`${state.settings.chapterName} · ${state.settings.period || "6-month window"} · ${state.settings.meetingsHeld} meetings. Scores use the chapter workbook rules. Coaching, tasks, goals and the next meeting all read the same numbers.`}
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active members" value={active.length} hint={`${green} green`} />
        <Stat label="Red or black" value={urgent.filter((row) => row.light === "red" || row.light === "black").length} hint={`${edge.length} green members on the edge`} />
        <Stat label="Open tasks" value={tasks.length} hint={tasks[0] ? `Next due ${formatDate(tasks[0].due)}` : "Nothing open"} />
        <Stat label="Visitors to seat" value={coming.length} hint={meeting ? formatDate(meeting.date) : "No meeting dated"} />
      </div>

      <section className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {pulse.map((item) => (
          <div key={item.key} className="card flex items-baseline justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-sm text-muted">{item.label}</p>
              <p className="font-semibold">{item.value}</p>
            </div>
            <p className={`text-sm ${item.behind ? "font-semibold text-red" : "text-muted"}`}>
              {item.target ? `Goal ${item.target}` : "No goal"}
              {item.behind ? " · behind" : ""}
            </p>
          </div>
        ))}
      </section>

      {state.lastImport && (
        <section className="card mt-4 p-4">
          <p className="text-sm font-semibold">
            Last file · {state.lastImport.fileName} · {state.lastImport.kind}
          </p>
          <p className="mt-1 text-sm text-muted">
            Matched {state.lastImport.matched}, added {state.lastImport.created}. {state.lastImport.notes[0]}
          </p>
        </section>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="card p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl">Who needs a move</h2>
            <button
              className="btn"
              disabled={ideas.length === 0}
              onClick={() => {
                state.addTasks(ideas);
                toast.success(`Added ${ideas.length} task${ideas.length === 1 ? "" : "s"}`);
              }}
            >
              {ideas.length ? `Create ${ideas.length} tasks` : "Tasks are current"}
            </button>
          </div>
          <p className="mb-2 text-sm text-muted">
            Red and black first. Each line is the set of bands that actually add points, not a jump to the maximum. Green members between 70 and 74 stay on the edge list.
          </p>
          <ul className="divide-y divide-border">
            {urgent.slice(0, 8).map((row) => (
              <li key={row.member.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Link to="/members/$memberId" params={{ memberId: row.member.id }} className="font-semibold hover:underline">
                    {row.member.name}
                  </Link>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{row.nextStep}</p>
                </div>
                <LightPill light={row.light} score={row.score} />
              </li>
            ))}
            {urgent.length === 0 && <li className="py-6 text-sm text-muted">Nobody is red or black.</li>}
          </ul>
          {edge.length > 0 && (
            <p className="mt-3 text-sm text-muted">
              {edge.length} green {edge.length === 1 ? "member is" : "members are"} between 70 and 74:{" "}
              {edge
                .slice(0, 6)
                .map((row) => row.member.name)
                .join(", ")}
              {edge.length > 6 ? ` and ${edge.length - 6} more` : ""}.
            </p>
          )}
        </section>

        <div className="flex flex-col gap-4">
          <section className="card p-4">
            <h2 className="font-display text-2xl">This meeting</h2>
            {meeting ? (
              <p className="mt-1 text-sm text-muted">
                {meeting.title} · {formatDate(meeting.date)}
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted">No upcoming chapter meeting on the calendar.</p>
            )}
            <ul className="mt-3 space-y-2 text-sm">
              {coming.map((visitor) => (
                <li key={visitor.id}>
                  <span className="font-semibold">{visitor.name}</span>
                  <span className="text-muted"> · invited by {state.members.find((member) => member.id === visitor.invitedById)?.name ?? "—"}</span>
                </li>
              ))}
              {coming.length === 0 && <li className="text-muted">No confirmed visitors.</li>}
            </ul>
            {openApps.length > 0 && (
              <p className="mt-3 text-sm">
                <Link to="/applications" className="font-semibold text-primary">
                  {openApps.length} open application{openApps.length > 1 ? "s" : ""}
                </Link>
              </p>
            )}
          </section>
          <section className="card p-4">
            <h2 className="font-display text-2xl">Coming up</h2>
            <ul className="mt-2 divide-y divide-border">
              {events.map((event) => (
                <li key={event.id} className="py-2">
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-muted">
                    {formatDate(event.date)} · {event.type}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">{noDates} members have no 5-minute date on file. The queue starts once a date is recorded.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
