import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildSeatPlan } from "@/lib/insights";
import { activityOf, findMember, type Interpreted, type TrafficRow } from "@/lib/import-report";
import { EMPTY_ACTIVITY, scoreActivity } from "@/lib/scoring";
import { DEFAULT_SETTINGS, SEED_APPLICATIONS, SEED_EVENTS, SEED_MEMBERS, SEED_PRESENTATIONS, SEED_TASKS, SEED_VISITORS } from "@/lib/seed";
import type {
  Application,
  AppStatus,
  ChapterEvent,
  LastImport,
  Member,
  Presentation,
  Seat,
  Task,
  TaskStatus,
  TrainingRoster,
  Visitor,
  VisitorStatus,
} from "@/lib/types";
import { addDays, uid } from "@/lib/utils";

type State = {
  hydrated: boolean;
  settings: typeof DEFAULT_SETTINGS;
  members: Member[];
  tasks: Task[];
  events: ChapterEvent[];
  visitors: Visitor[];
  applications: Application[];
  presentations: Presentation[];
  seats: Seat[];
  rosters: TrainingRoster[];
  lastImport: LastImport | null;
  setHydrated: (value: boolean) => void;
  updateSettings: (patch: Partial<Pick<State["settings"], "chapterName" | "meetingsHeld" | "period">>) => void;
  updateMember: (id: string, patch: Partial<Member>) => void;
  addMember: (member: Member) => void;
  addTask: (task: Omit<Task, "id">) => void;
  addTasks: (tasks: Omit<Task, "id">[]) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  addEvent: (event: Omit<ChapterEvent, "id">) => void;
  addVisitor: (visitor: Omit<Visitor, "id">) => void;
  setVisitorStatus: (id: string, status: VisitorStatus) => void;
  addApplication: (app: Omit<Application, "id">) => void;
  setApplicationStatus: (id: string, status: AppStatus) => void;
  setVotes: (id: string, votesFor: number, votesAgainst: number) => void;
  approveApplication: (id: string) => void;
  addPresentation: (item: Omit<Presentation, "id">) => void;
  setSeats: (seats: Seat[]) => void;
  autoSeat: () => void;
  assignSeat: (tableId: string, slot: number, kind: Seat["kind"], personId: string) => void;
  clearSeat: (tableId: string, slot: number) => void;
  applyFile: (file: Interpreted, createUnmatched: boolean) => LastImport;
  resetDemo: () => void;
};

const seedState = {
  settings: DEFAULT_SETTINGS,
  members: SEED_MEMBERS,
  tasks: SEED_TASKS,
  events: SEED_EVENTS,
  visitors: SEED_VISITORS,
  applications: SEED_APPLICATIONS,
  presentations: SEED_PRESENTATIONS,
  seats: [] as Seat[],
  rosters: [] as TrainingRoster[],
  lastImport: null as LastImport | null,
};

function blankMember(name: string, weeks: number): Member {
  return {
    id: uid("m"),
    name,
    company: "",
    category: "",
    active: true,
    lastPresentation: "",
    pitch: "",
    ...EMPTY_ACTIVITY,
    weeks,
  };
}

function withActivity(member: Member, row: TrafficRow): Member {
  return { ...member, ...row.activity, name: member.name };
}

export const useChapter = create<State>()(
  persist(
    (set, get) => ({
      hydrated: false,
      ...seedState,
      setHydrated: (hydrated) => set({ hydrated }),
      updateSettings: (patch) =>
        set((state) => {
          const settings = { ...state.settings, ...patch };
          const members =
            patch.meetingsHeld !== undefined
              ? state.members.map((member) => ({ ...member, weeks: settings.meetingsHeld }))
              : state.members;
          return { settings, members };
        }),
      updateMember: (id, patch) =>
        set((state) => ({ members: state.members.map((member) => (member.id === id ? { ...member, ...patch } : member)) })),
      addMember: (member) => set((state) => ({ members: [...state.members, member] })),
      addTask: (task) =>
        set((state) => {
          if (task.source && state.tasks.some((item) => item.source === task.source && item.status !== "done")) return state;
          return { tasks: [{ ...task, id: uid("t") }, ...state.tasks] };
        }),
      addTasks: (tasks) =>
        set((state) => {
          const open = new Set(state.tasks.filter((task) => task.status !== "done").map((task) => task.source));
          const fresh = tasks.filter((task) => !task.source || !open.has(task.source));
          return { tasks: [...fresh.map((task) => ({ ...task, id: uid("t") })), ...state.tasks] };
        }),
      setTaskStatus: (id, status) =>
        set((state) => ({ tasks: state.tasks.map((task) => (task.id === id ? { ...task, status } : task)) })),
      addEvent: (event) => set((state) => ({ events: [...state.events, { ...event, id: uid("e") }] })),
      addVisitor: (visitor) => set((state) => ({ visitors: [...state.visitors, { ...visitor, id: uid("v") }] })),
      setVisitorStatus: (id, status) =>
        set((state) => {
          const visitors = state.visitors.map((visitor) => (visitor.id === id ? { ...visitor, status } : visitor));
          if (status !== "applied") return { visitors };
          const visitor = visitors.find((item) => item.id === id);
          if (!visitor || state.applications.some((app) => app.visitorId === id)) return { visitors };
          const appId = uid("a");
          return {
            visitors,
            applications: [
              {
                id: appId,
                name: visitor.name,
                company: visitor.company,
                category: "",
                visitorId: visitor.id,
                interviewer: "VP",
                status: "interview",
                votesFor: 0,
                votesAgainst: 0,
                notes: visitor.notes,
              },
              ...state.applications,
            ],
            tasks: [
              {
                id: uid("t"),
                source: `app:${appId}`,
                team: "MC",
                title: `Interview ${visitor.name}`,
                detail: `Came as a visitor invited by ${state.members.find((member) => member.id === visitor.invitedById)?.name ?? "a member"}. Interest ${visitor.interest}/5.`,
                assignee: "VP",
                due: addDays(new Date().toISOString().slice(0, 10), 7),
                status: "pending",
              },
              ...state.tasks,
            ],
          };
        }),
      addApplication: (app) => set((state) => ({ applications: [{ ...app, id: uid("a") }, ...state.applications] })),
      setApplicationStatus: (id, status) =>
        set((state) => ({ applications: state.applications.map((app) => (app.id === id ? { ...app, status } : app)) })),
      setVotes: (id, votesFor, votesAgainst) =>
        set((state) => ({
          applications: state.applications.map((app) => (app.id === id ? { ...app, votesFor, votesAgainst } : app)),
        })),
      approveApplication: (id) => {
        const app = get().applications.find((item) => item.id === id);
        if (!app || app.status === "approved") return;
        const weeks = get().settings.meetingsHeld;
        const member = blankMember(app.name, weeks);
        member.company = app.company;
        member.category = app.category;
        const due = addDays(new Date().toISOString().slice(0, 10), 30);
        set((state) => ({
          applications: state.applications.map((item) => (item.id === id ? { ...item, status: "approved" } : item)),
          members: state.members.some((item) => item.name.toLowerCase() === app.name.toLowerCase()) ? state.members : [...state.members, member],
          tasks: [
            {
              id: uid("t"),
              source: `mentor:${id}`,
              team: "Mentor",
              title: `Assign a mentor for ${app.name}`,
              detail: "New member. Mentor coordinator owns the first 1-2-1s.",
              assignee: "Mentor Coordinator",
              due,
              status: "pending",
              memberId: member.id,
            },
            {
              id: uid("t"),
              source: `msp-new:${id}`,
              team: "Education",
              title: `Book MSP for ${app.name} within 30 days`,
              detail: "New members must complete MSP within 30 days.",
              assignee: "Education Coordinator",
              due,
              status: "pending",
              memberId: member.id,
            },
            ...state.tasks.map((task) => (task.source === `app:${id}` ? { ...task, status: "done" as const } : task)),
          ],
        }));
      },
      addPresentation: (item) =>
        set((state) => ({
          presentations: [{ ...item, id: uid("p") }, ...state.presentations],
          members: state.members.map((member) =>
            member.id === item.memberId ? { ...member, lastPresentation: item.date, pitch: item.kind === "20-sec" ? item.title : member.pitch } : member,
          ),
          tasks: state.tasks.map((task) =>
            task.source === `present:${item.memberId}` && task.status !== "done" ? { ...task, status: "done" } : task,
          ),
        })),
      setSeats: (seats) => set({ seats }),
      autoSeat: () => {
        const { visitors, members } = get();
        set({ seats: buildSeatPlan(visitors, members) });
      },
      assignSeat: (tableId, slot, kind, personId) =>
        set((state) => ({
          seats: [
            ...state.seats.filter(
              (seat) => !(seat.tableId === tableId && seat.slot === slot) && !(seat.kind === kind && seat.personId === personId),
            ),
            { tableId, slot, kind, personId },
          ],
        })),
      clearSeat: (tableId, slot) =>
        set((state) => ({ seats: state.seats.filter((seat) => !(seat.tableId === tableId && seat.slot === slot)) })),
      applyFile: (file, createUnmatched) => {
        const now = new Date().toISOString();
        if (file.kind === "unknown") {
          const lastImport: LastImport = { at: now, fileName: file.fileName, kind: file.kind, matched: 0, created: 0, changes: [], notes: file.notes };
          set({ lastImport });
          return lastImport;
        }
        if (file.kind === "goals") {
          const lastImport: LastImport = {
            at: now,
            fileName: file.fileName,
            kind: file.kind,
            matched: file.goals.length,
            created: 0,
            changes: [],
            notes: file.notes,
          };
          set((state) => ({ settings: { ...state.settings, goals: file.goals }, lastImport }));
          return lastImport;
        }
        if (file.kind === "msp") {
          const notes = [...file.notes];
          const names = file.positive.map((person) => person.name);
          set((state) => {
            const haveRoster = state.rosters.some((roster) => roster.date === file.date && roster.title === file.title);
            const haveEvent = state.events.some((event) => event.type === "training" && event.date === file.date && /msp/i.test(event.title));
            return {
              rosters: haveRoster || !names.length ? state.rosters : [{ id: uid("r"), date: file.date, title: file.title, names }, ...state.rosters],
              events:
                haveEvent || !file.date
                  ? state.events
                  : [
                      ...state.events,
                      {
                        id: uid("e"),
                        title: file.title || "MSP",
                        date: file.date,
                        type: "training" as const,
                        notes: `${names.length} Positive members signed in.`,
                      },
                    ],
            };
          });
          const lastImport: LastImport = {
            at: now,
            fileName: file.fileName,
            kind: file.kind,
            matched: names.length,
            created: 0,
            changes: [],
            notes,
          };
          set({ lastImport });
          return lastImport;
        }

        const { members, settings } = get();
        const nextMembers = members.map((member) => ({ ...member }));
        const changes: LastImport["changes"] = [];
        const notes = [...file.notes];
        let matched = 0;
        let created = 0;
        for (const row of file.rows) {
          const existing = findMember(nextMembers, row.name);
          if (existing) {
            const from = scoreActivity(activityOf(existing)).total;
            const index = nextMembers.findIndex((member) => member.id === existing.id);
            nextMembers[index] = withActivity(existing, row);
            const to = row.calculatedScore;
            matched += 1;
            if (from !== to || (row.reportedScore !== null && row.reportedScore !== to)) {
              changes.push({ name: existing.name, from, to, reported: row.reportedScore });
            }
          } else if (createUnmatched) {
            const member = blankMember(row.name, row.activity.weeks || file.weeks);
            nextMembers.push(withActivity(member, row));
            created += 1;
          } else {
            notes.push(`${row.name} was not matched.`);
          }
        }
        const disagreed = file.rows.filter((row) => row.reportedScore !== null && row.reportedScore !== row.calculatedScore).length;
        if (disagreed) notes.push(`${disagreed} printed totals were ignored because the raw counts score differently.`);
        const lastImport: LastImport = { at: now, fileName: file.fileName, kind: file.kind, matched, created, changes, notes };
        set({
          members: nextMembers,
          settings: {
            ...settings,
            meetingsHeld: file.weeks || settings.meetingsHeld,
            period: file.period || settings.period,
          },
          lastImport,
        });
        return lastImport;
      },
      resetDemo: () => set({ ...seedState, hydrated: true }),
    }),
    {
      name: "bni-positive-chapter-v3",
      skipHydration: true,
      partialize: (state) => ({
        settings: state.settings,
        members: state.members,
        tasks: state.tasks,
        events: state.events,
        visitors: state.visitors,
        applications: state.applications,
        presentations: state.presentations,
        seats: state.seats,
        rosters: state.rosters,
        lastImport: state.lastImport,
      }),
    },
  ),
);
