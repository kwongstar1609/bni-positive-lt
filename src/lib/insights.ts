import { activityOf, findMember } from "@/lib/import-report";
import { formatMoney, formatRate, nextBand, planToTarget, scoreActivity, type Light } from "@/lib/scoring";
import { TABLES } from "@/lib/tables";
import type { Application, ChapterEvent, Goal, Member, Seat, Task, TrainingRoster, Visitor } from "@/lib/types";
import { todayISO } from "@/lib/utils";

export type CoachingRow = {
  member: Member;
  score: number;
  light: Light;
  nextStep: string;
  edge: boolean;
};

export function memberScore(member: Member) {
  return scoreActivity(activityOf(member));
}

export function coachingList(members: Member[]): CoachingRow[] {
  return members
    .filter((member) => member.active)
    .map((member) => {
      const scored = memberScore(member);
      const edge = scored.light === "green" && scored.total < 75;
      const target = scored.light === "green" ? 75 : nextBand(scored.total);
      const plan = planToTarget(activityOf(member), target);
      const moves = plan.filter((action) => action.pointsGain > 0);
      const shown = moves
        .slice(0, 3)
        .map((action) => `${action.label} (+${action.pointsGain})`)
        .join("; ");
      const extra = moves.length > 3 ? ` and ${moves.length - 3} more` : "";
      const gained = moves.reduce((sum, action) => sum + action.pointsGain, 0);
      const short = scored.total + gained < target;
      const locked = plan.find((action) => action.key === "locked");
      const nextStep = !moves.length
        ? locked?.label || "No lever left inside this window."
        : `${scored.light === "green" ? "On the edge of green." : `To reach ${target}:`} ${shown}${extra}${short ? ". Still short — absences or lates are already locked." : "."}`;
      return { member, score: scored.total, light: scored.light, nextStep, edge };
    })
    .filter((row) => row.light !== "green" || row.edge)
    .sort((a, b) => a.score - b.score);
}

export type PulseItem = {
  key: string;
  label: string;
  value: string;
  target: string | null;
  behind: boolean;
};

function goalOf(goals: Goal[], key: string) {
  return goals.find((goal) => goal.key === key) ?? null;
}

function behind(value: number, target: number | null, lowerIsBetter: boolean) {
  if (target === null) return false;
  return lowerIsBetter ? value > target : value < target;
}

export function chapterPulse(members: Member[], goals: Goal[]): PulseItem[] {
  const active = members.filter((member) => member.active);
  const count = active.length;
  if (!count) return [];
  const weeks = active[0]?.weeks || 25;
  const scores = active.map((member) => memberScore(member));
  const green = scores.filter((score) => score.light === "green").length;
  const average = scores.reduce((sum, score) => sum + score.total, 0) / count;
  const referrals = active.reduce((sum, member) => sum + member.referrals, 0) / count / weeks;
  const visitors = active.reduce((sum, member) => sum + member.visitors, 0) / weeks;
  const training = active.reduce((sum, member) => sum + member.training, 0) / count;
  const slots = count * weeks;
  const absenteeism = slots > 0 ? (active.reduce((sum, member) => sum + member.absent, 0) / slots) * 100 : 0;
  const oneToOnes = active.reduce((sum, member) => sum + member.oneToOnes, 0) / count / weeks;
  const tyfcb = active.reduce((sum, member) => sum + member.tyfcbAmount, 0);

  const items: { key: string; label: string; value: number; text: string; goalKey: string; lower?: boolean; format: (n: number) => string }[] = [
    { key: "size", label: "Members", value: count, text: String(count), goalKey: "size", format: (n) => String(Math.round(n)) },
    { key: "green", label: "Green", value: (green / count) * 100, text: `${green} · ${Math.round((green / count) * 100)}%`, goalKey: "", format: (n) => `${Math.round(n)}%` },
    { key: "score", label: "Average score", value: average, text: average.toFixed(0), goalKey: "trafficLight", format: (n) => String(Math.round(n)) },
    { key: "referrals", label: "Referrals / member / week", value: referrals, text: formatRate(referrals), goalKey: "referralsPerWeek", format: formatRate },
    { key: "visitors", label: "Visitors / week", value: visitors, text: formatRate(visitors), goalKey: "visitorsPerWeek", format: formatRate },
    { key: "training", label: "Training / member", value: training, text: formatRate(training), goalKey: "training", format: formatRate },
    { key: "absent", label: "Absenteeism", value: absenteeism, text: `${absenteeism.toFixed(1)}%`, goalKey: "absenteeism", lower: true, format: (n) => `${n}%` },
    { key: "121", label: "1-2-1s / member / week", value: oneToOnes, text: formatRate(oneToOnes), goalKey: "oneToOnes", format: formatRate },
    { key: "tyfcb", label: "TYFCB", value: tyfcb, text: formatMoney(tyfcb), goalKey: "revenue", format: formatMoney },
  ];

  return items.map((item) => {
    const goal = item.goalKey ? goalOf(goals, item.goalKey) : null;
    const target = goal?.target6 ?? null;
    return {
      key: item.key,
      label: item.label,
      value: item.text,
      target: target === null ? null : item.format(target),
      behind: behind(item.value, target, item.lower ?? goal?.lowerIsBetter ?? false),
    };
  });
}

export function presentersDue(members: Member[], today = todayISO()) {
  const cutoff = new Date(today + "T00:00:00");
  cutoff.setDate(cutoff.getDate() - 70);
  return members
    .filter((member) => member.active && member.lastPresentation)
    .filter((member) => new Date(member.lastPresentation + "T00:00:00") < cutoff)
    .sort((a, b) => a.lastPresentation.localeCompare(b.lastPresentation));
}

export function unrecordedPresentations(members: Member[]) {
  return members.filter((member) => member.active && !member.lastPresentation).length;
}

export function nextMeeting(events: ChapterEvent[], today = todayISO()) {
  return events
    .filter((event) => event.type === "meeting" && event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}

export function upcomingEvents(events: ChapterEvent[], today = todayISO()) {
  return events
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);
}

export function openTasks(tasks: Task[]) {
  return tasks.filter((task) => task.status !== "done").sort((a, b) => a.due.localeCompare(b.due));
}

export function visitorsToSeat(visitors: Visitor[]) {
  return visitors.filter((visitor) => visitor.status === "confirmed" || visitor.status === "attended");
}

export function seatWarnings(seats: Seat[], visitors: Visitor[], members: Member[]) {
  const warnings: string[] = [];
  const seatedMembers = new Set<string>();
  const seatedVisitors = new Set<string>();
  for (const seat of seats) {
    if (seat.kind === "member") {
      if (seatedMembers.has(seat.personId)) warnings.push("A member is seated twice.");
      seatedMembers.add(seat.personId);
    } else {
      if (seatedVisitors.has(seat.personId)) warnings.push("A visitor is seated twice.");
      seatedVisitors.add(seat.personId);
    }
  }
  for (const table of TABLES.filter((item) => item.kind === "visitor")) {
    const here = seats.filter((seat) => seat.tableId === table.id);
    const hasVisitor = here.some((seat) => seat.kind === "visitor");
    const hasMember = here.some((seat) => seat.kind === "member");
    if (hasVisitor && !hasMember) warnings.push(`${table.label} has a visitor and no member host.`);
  }
  for (const visitor of visitorsToSeat(visitors)) {
    const seat = seats.find((item) => item.kind === "visitor" && item.personId === visitor.id);
    if (!seat) continue;
    const host = seats.find((item) => item.tableId === seat.tableId && item.kind === "member");
    if (host && host.personId !== visitor.invitedById && visitor.invitedById) {
      const inviter = members.find((member) => member.id === visitor.invitedById);
      if (inviter && !seats.some((item) => item.tableId === seat.tableId && item.personId === inviter.id)) {
        warnings.push(`${visitor.name} is not at the same table as ${inviter.name}.`);
      }
    }
  }
  const missing = visitorsToSeat(visitors).filter((visitor) => !seatedVisitors.has(visitor.id));
  if (missing.length) warnings.push(`${missing.length} confirmed visitor${missing.length > 1 ? "s are" : " is"} not seated.`);
  return [...new Set(warnings)];
}

export function buildSeatPlan(visitors: Visitor[], members: Member[]): Seat[] {
  const seats: Seat[] = [];
  const usedMembers = new Set<string>();
  const visitorTables = TABLES.filter((table) => table.kind === "visitor");
  let tableIndex = 0;

  for (const visitor of visitorsToSeat(visitors)) {
    let placed = false;
    for (let attempt = 0; attempt < visitorTables.length && !placed; attempt++) {
      const table = visitorTables[(tableIndex + attempt) % visitorTables.length];
      const used = seats.filter((seat) => seat.tableId === table.id).map((seat) => seat.slot);
      const free = Array.from({ length: table.seats }, (_, index) => index).filter((index) => !used.includes(index));
      if (!free.length) continue;
      seats.push({ tableId: table.id, slot: free[0], kind: "visitor", personId: visitor.id });
      const host = members.find((member) => member.id === visitor.invitedById && member.active && !usedMembers.has(member.id));
      if (host && free.length > 1) {
        seats.push({ tableId: table.id, slot: free[1], kind: "member", personId: host.id });
        usedMembers.add(host.id);
      }
      tableIndex = (tableIndex + attempt + 1) % visitorTables.length;
      placed = true;
    }
  }

  for (const member of members.filter((item) => item.active && item.category && !usedMembers.has(item.id))) {
    const preferred = TABLES.find((table) => table.kind === "category" && table.categories.includes(member.category));
    if (!preferred) continue;
    const used = seats.filter((seat) => seat.tableId === preferred.id).map((seat) => seat.slot);
    const free = Array.from({ length: preferred.seats }, (_, index) => index).find((index) => !used.includes(index));
    if (free === undefined) continue;
    seats.push({ tableId: preferred.id, slot: free, kind: "member", personId: member.id });
    usedMembers.add(member.id);
  }
  return seats;
}

export function rosterHits(member: Member, rosters: TrainingRoster[]) {
  return rosters.filter((roster) => roster.names.some((name) => findMember([member], name)));
}

export function suggestedTasks(input: {
  members: Member[];
  tasks: Task[];
  visitors: Visitor[];
  applications: Application[];
  events: ChapterEvent[];
  goals: Goal[];
  today?: string;
}): Omit<Task, "id">[] {
  const today = input.today ?? todayISO();
  const openSources = new Set(input.tasks.filter((task) => task.status !== "done").map((task) => task.source));
  const meeting = nextMeeting(input.events, today);
  const due = meeting?.date ?? today;
  const out: Omit<Task, "id">[] = [];
  const push = (task: Omit<Task, "id">) => {
    if (openSources.has(task.source)) return;
    openSources.add(task.source);
    out.push(task);
  };

  const rows = coachingList(input.members).filter((row) => !row.edge && (row.light === "black" || row.light === "red"));
  for (const row of rows) {
    const policy = policyLine(row.member);
    push({
      source: `coach:${row.member.id}`,
      team: "Green Light",
      title: `Coach ${row.member.name} (${row.light} ${row.score})`,
      detail: policy ? `${row.nextStep} ${policy}` : row.nextStep,
      assignee: "Green Light Coordinator",
      due,
      status: "pending",
      memberId: row.member.id,
    });
  }

  for (const member of input.members.filter((item) => item.active)) {
    const scored = memberScore(member);
    if (scored.light === "black" || scored.light === "red") continue;
    if (member.absent >= 3) {
      push({
        source: `policy:absent:${member.id}`,
        team: "MC",
        title: `${member.name} has ${member.absent} absences`,
        detail: "Member policy allows 3 absences in 6 months. More than 2 already scores 0 attendance points.",
        assignee: "VP",
        due,
        status: "pending",
        memberId: member.id,
      });
    } else if (member.substitute >= 3) {
      push({
        source: `policy:sub:${member.id}`,
        team: "MC",
        title: `${member.name} has used ${member.substitute} substitutes`,
        detail: "The interview standard is no more than 3 substitutes in 6 months.",
        assignee: "VP",
        due,
        status: "pending",
        memberId: member.id,
      });
    }
  }

  const untrained = input.members.filter((member) => member.active && member.training < 1);
  if (untrained.length) {
    push({
      source: "training:gap",
      team: "Education",
      title: `${untrained.length} members have no skills module in this window`,
      detail: untrained
        .slice(0, 12)
        .map((member) => member.name)
        .join(", ")
        .concat(untrained.length > 12 ? ` and ${untrained.length - 12} more` : ""),
      assignee: "Education Coordinator",
      due,
      status: "pending",
    });
  }

  for (const member of presentersDue(input.members, today).slice(0, 2)) {
    push({
      source: `present:${member.id}`,
      team: "ST",
      title: `Schedule a 5-minute for ${member.name}`,
      detail: `Last feature was ${member.lastPresentation}. Rehearse so the specialty does not overlap.`,
      assignee: "ST Sub-committee",
      due,
      status: "pending",
      memberId: member.id,
    });
  }

  const unseated = visitorsToSeat(input.visitors);
  if (unseated.length && meeting) {
    push({
      source: `seat:${meeting.id}`,
      team: "Visitor Hosts",
      title: `Seat ${unseated.length} visitor${unseated.length > 1 ? "s" : ""} for ${meeting.date}`,
      detail: unseated.map((visitor) => `${visitor.name} (invited by ${input.members.find((m) => m.id === visitor.invitedById)?.name ?? "unknown"})`).join("; "),
      assignee: "Visitor Hosts",
      due: meeting.date,
      status: "pending",
    });
  }

  for (const app of input.applications.filter((item) => item.status === "voting" || item.status === "interview")) {
    push({
      source: `app:${app.id}`,
      team: "MC",
      title: app.status === "voting" ? `Close the vote for ${app.name}` : `Finish the interview for ${app.name}`,
      detail: app.notes || "Application is still open.",
      assignee: "VP",
      due,
      status: "pending",
    });
  }

  const pulse = chapterPulse(input.members, input.goals).filter((item) => item.behind && item.key !== "size");
  for (const item of pulse.slice(0, 3)) {
    push({
      source: `goal:${item.key}`,
      team: "LT",
      title: `${item.label} is behind the 6-month goal`,
      detail: `Now ${item.value}. Goal ${item.target}.`,
      assignee: "President",
      due,
      status: "pending",
    });
  }

  return out;
}

function policyLine(member: Member) {
  const bits: string[] = [];
  if (member.absent >= 2) bits.push(`${member.absent} absences`);
  if (member.late >= 2) bits.push(`${member.late} lates`);
  if (member.substitute >= 3) bits.push(`${member.substitute} substitutes`);
  if (member.training < 1) bits.push("no skills module");
  return bits.length ? `Also: ${bits.join(", ")}.` : "";
}
