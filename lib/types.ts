import type { Activity } from "@/lib/scoring";

export type Member = Activity & {
  id: string;
  name: string;
  company: string;
  category: string;
  active: boolean;
  lastPresentation: string;
  pitch: string;
};

export type TaskStatus = "pending" | "in-progress" | "done";

export type Task = {
  id: string;
  source: string;
  team: string;
  title: string;
  detail: string;
  assignee: string;
  due: string;
  status: TaskStatus;
  memberId?: string;
};

export type ChapterEvent = {
  id: string;
  title: string;
  date: string;
  type: "meeting" | "training" | "rehearsal" | "social" | "international" | "birthday";
  notes: string;
};

export type VisitorStatus = "invited" | "confirmed" | "attended" | "applied" | "declined";

export type Visitor = {
  id: string;
  name: string;
  company: string;
  invitedById: string;
  interest: number;
  knowsBni: number;
  notes: string;
  status: VisitorStatus;
};

export type AppStatus = "interview" | "voting" | "approved" | "rejected";

export type Application = {
  id: string;
  name: string;
  company: string;
  category: string;
  visitorId?: string;
  interviewer: string;
  status: AppStatus;
  votesFor: number;
  votesAgainst: number;
  notes: string;
};

export type Presentation = {
  id: string;
  memberId: string;
  date: string;
  kind: "5-min" | "gains" | "20-sec";
  title: string;
};

export type Seat = {
  tableId: string;
  slot: number;
  kind: "member" | "visitor";
  personId: string;
};

export type Goal = {
  key: string;
  label: string;
  target6: number | null;
  target12: number | null;
  lowerIsBetter: boolean;
};

export type TrainingRoster = {
  id: string;
  date: string;
  title: string;
  names: string[];
};

export type ImportChange = {
  name: string;
  from: number;
  to: number;
  reported: number | null;
};

export type LastImport = {
  at: string;
  fileName: string;
  kind: string;
  matched: number;
  created: number;
  changes: ImportChange[];
  notes: string[];
};

export type Settings = {
  chapterName: string;
  meetingsHeld: number;
  period: string;
  goals: Goal[];
};
